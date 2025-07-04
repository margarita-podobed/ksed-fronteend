import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Upload,
  Button,
  Space,
  InputNumber,
  Select,
  Card,
  Input,
  Tooltip,
  Popover,
  Checkbox,
} from 'antd';
import {
  FileTextOutlined,
  LeftOutlined,
  RightOutlined,
  ZoomOutOutlined,
  ZoomInOutlined,
  DownloadOutlined,
  PrinterOutlined,
  FullscreenOutlined,
  SearchOutlined,
  UpOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';

const { Dragger } = Upload;
const { Option } = Select;

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export default function PdfViewer() {
  const [fileUrl, setFileUrl] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [zoom, setZoom] = useState(1);

  const [query, setQuery] = useState('');
  const [hits, setHits] = useState([]); 
  const [hitIdx, setHitIdx] = useState(-1);
  const [caseSens, setCaseSens] = useState(false);
  const [doHl, setDoHl] = useState(true);

  const viewerRef = useRef(null);

  useEffect(() => () => fileUrl && URL.revokeObjectURL(fileUrl), [fileUrl]);

  const loadFile = (file) => {
    fileUrl && URL.revokeObjectURL(fileUrl);
    setFileUrl(URL.createObjectURL(file));
    setPdfDoc(null);
    setNumPages(0);
    setPageNum(1);
    setZoom(1);
    setQuery('');
    setHits([]);
    setHitIdx(-1);
  };

  const runSearch = useCallback(
    async (q) => {
      if (!pdfDoc || !q.trim()) {
        setHits([]);
        setHitIdx(-1);
        return;
      }
      const term = q.trim();
      const regex = new RegExp(esc(term), caseSens ? 'g' : 'gi');
      const found = [];
      for (let p = 1; p <= pdfDoc.numPages; p++) {
        // eslint-disable-next-line no-await-in-loop
        const page = await pdfDoc.getPage(p);
        // eslint-disable-next-line no-await-in-loop
        const content = await page.getTextContent();
        const text = content.items.map((t) => t.str).join(' ');
        if (regex.test(text)) found.push({ page: p });
      }
      setHits(found);
      setHitIdx(found.length ? 0 : -1);
      if (found.length) setPageNum(found[0].page);
    },
    [pdfDoc, caseSens]
  );

  const onDocLoad = (pdf) => {
    setPdfDoc(pdf);
    setNumPages(pdf.numPages);
  };
  const changePage = (off) =>
    setPageNum((p) => Math.min(Math.max(p + off, 1), numPages));

  useEffect(() => {
    const container = document.getElementById('pdf-container');
    if (!container) return;

    container
      .querySelectorAll('.react-pdf__Page__textContent span')
      .forEach((span) => {
        if (span.dataset.orig) {
          span.innerHTML = span.dataset.orig;
          delete span.dataset.orig;
        }
      });

    if (!query.trim() || !doHl) return;

    const regex = new RegExp(esc(query.trim()), caseSens ? 'g' : 'gi');
    container
      .querySelectorAll('.react-pdf__Page__textContent span')
      .forEach((span) => {
        if (regex.test(span.textContent)) {
          span.dataset.orig = span.innerHTML;
          span.innerHTML = span.textContent.replace(
            regex,
            (m) => `<mark style="background:#ffeb3b">${m}</mark>`
          );
        }
      });
    const mk = container.querySelector('mark');
    if (mk) mk.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [pageNum, zoom, query, caseSens, doHl]);

  const gotoHit = (dir) => {
    if (!hits.length) return;
    setHitIdx((idx) => {
      const next = (idx + dir + hits.length) % hits.length;
      setPageNum(hits[next].page);
      return next;
    });
  };

  const downloadPdf = () => {
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = 'document.pdf';
    a.click();
  };
  const printPdf = () => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = fileUrl;
    document.body.appendChild(iframe);
    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        document.body.removeChild(iframe);
      }, 200);
    };
  };
  const toggleFullscreen = () => {
    const el = viewerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  // Popover-контент
  const popContent = (
    <Space direction='vertical'>
      <Input
        placeholder='Найти…'
        size='small'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onPressEnter={() => runSearch(query)}
        style={{ width: 200 }}
      />
      <Space>
        <Tooltip title='предыдущее'>
          <Button
            icon={<UpOutlined />}
            size='small'
            disabled={!hits.length}
            onClick={() => gotoHit(-1)}
          />
        </Tooltip>
        <Tooltip title='следующее'>
          <Button
            icon={<DownOutlined />}
            size='small'
            disabled={!hits.length}
            onClick={() => gotoHit(1)}
          />
        </Tooltip>
        <span style={{ width: 46, textAlign: 'center', fontSize: 12 }}>
          {hits.length ? `${hitIdx + 1}/${hits.length}` : '0/0'}
        </span>
      </Space>
      <Checkbox checked={doHl} onChange={(e) => setDoHl(e.target.checked)}>
        Подсветить все
      </Checkbox>
      <Checkbox
        checked={caseSens}
        onChange={(e) => setCaseSens(e.target.checked)}
      >
        С учётом регистра
      </Checkbox>
      <Button
        type='primary'
        size='small'
        block
        onClick={() => runSearch(query)}
      >
        Искать
      </Button>
    </Space>
  );

  return (
    <Card
      bordered
      style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}
      bodyStyle={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
      }}
    >
      {fileUrl && (
        <Space wrap style={{ margin: '8px 8px 0 8px' }}>
          <Button
            icon={<LeftOutlined />}
            disabled={pageNum <= 1}
            onClick={() => changePage(-1)}
          />
          <InputNumber
            min={1}
            max={numPages}
            value={pageNum}
            onChange={(v) => v && setPageNum(v)}
            style={{ width: 70 }}
          />
          <span>/ {numPages}</span>
          <Button
            icon={<RightOutlined />}
            disabled={pageNum >= numPages}
            onClick={() => changePage(1)}
          />

          <Select
            value={`${Math.round(zoom * 100)}%`}
            onChange={(v) => setZoom(v / 100)}
            style={{ width: 90 }}
          >
            {['50', '75', '100', '125', '150', '200'].map((z) => (
              <Option key={z} value={Number(z)}>
                {z}%
              </Option>
            ))}
          </Select>
          <Button
            icon={<ZoomOutOutlined />}
            onClick={() => setZoom((z) => Math.max(z - 0.1, 0.1))}
          />
          <Button
            icon={<ZoomInOutlined />}
            onClick={() => setZoom((z) => z + 0.1)}
          />

          <Popover
            placement='bottomLeft'
            trigger='click'
            content={popContent}
            getPopupContainer={() => document.body}
          >
            <Tooltip title='Поиск'>
              <Button icon={<SearchOutlined />} />
            </Tooltip>
          </Popover>

          <Button icon={<DownloadOutlined />} onClick={downloadPdf}>
            Скачать
          </Button>
          <Button icon={<PrinterOutlined />} onClick={printPdf}>
            Печать
          </Button>
          <Button icon={<FullscreenOutlined />} onClick={toggleFullscreen}>
            Полноэкран
          </Button>
        </Space>
      )}

      {!fileUrl ? (
        <Dragger
          accept='.pdf'
          multiple={false}
          showUploadList={false}
          beforeUpload={(f) => {
            loadFile(f);
            return false;
          }}
          style={{
            flex: 1,
            width: '95%',
            height: '100%',
            border: '2px dashed #d9d9d9',
            borderRadius: 8,
            background: '#fafafa',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '50px',
            marginLeft: '15px',
            marginRight: '15px',
          }}
        >
          <FileTextOutlined
            style={{
              fontSize: 64,
              color: '#FFD700',
              marginBottom: 16,
            }}
          />
          <p style={{ fontSize: 18, textAlign: 'center' }}>
            Для этого документа
            <br />
            еще не добавлено ни одно вложение
          </p>
        </Dragger>
      ) : (
        <div
          id='pdf-container'
          ref={viewerRef}
          style={{
            flex: 1,
            width: '100%',
            minHeight: 0,
            overflow: 'auto',
            overscrollBehavior: 'contain',
            background: '#fff',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}
        >
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'top center',
            }}
          >
            <Document
              file={fileUrl}
              onLoadSuccess={onDocLoad}
              loading='Загрузка PDF…'
              error='Не удалось загрузить документ'
            >
              <Page pageNumber={pageNum} scale={1} renderTextLayer={true} />
            </Document>
          </div>
        </div>
      )}
    </Card>
  );
}
