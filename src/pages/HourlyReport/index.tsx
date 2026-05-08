import { useState, useMemo } from 'react';
import {
  Card,
  DatePicker,
  Select,
  Table,
  Space,
  Row,
  Col,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

interface TableRow {
  key: string;
  date: string;
  hour: string;
  revenuePerMille: number;
  estimatedIncome: number;
  ecpm: number;
  requestValuePerMille: number;
  requests: number;
  returnRate: string;
  bidSuccess: number;
  bidSuccessRate: string;
  impressions: number;
  winShowRate: string;
  clicks: number;
  ctr: string;
  cpc: number;
}

const metricOptions = [
  { label: '千人均收益', value: 'revenuePerMille' },
  { label: '预估收入', value: 'estimatedIncome' },
  { label: 'eCPM', value: 'ecpm' },
  { label: '千次请求价值', value: 'requestValuePerMille' },
  { label: '请求量', value: 'requests' },
  { label: '返回率', value: 'returnRate' },
  { label: '竞价成功数', value: 'bidSuccess' },
  { label: '竞价成功率', value: 'bidSuccessRate' },
  { label: '展示量', value: 'impressions' },
  { label: '竞胜展示率', value: 'winShowRate' },
  { label: '点击数', value: 'clicks' },
  { label: '点击率', value: 'ctr' },
  { label: 'cpc', value: 'cpc' },
];

function generateHourlyData(): TableRow[] {
  const rows: TableRow[] = [];
  const dateStr = dayjs().format('YYYY-MM-DD');

  for (let i = 0; i < 24; i++) {
    const h = i.toString().padStart(2, '0');
    rows.push({
      key: `${dateStr}-${i}`,
      date: dateStr,
      hour: `${h}:00~${h}:59`,
      revenuePerMille: 100 + Math.random() * 50,
      estimatedIncome: 50000 + Math.random() * 30000,
      ecpm: 8 + Math.random() * 4,
      requestValuePerMille: 80 + Math.random() * 40,
      requests: 500000 + Math.floor(Math.random() * 200000),
      returnRate: `${(80 + Math.random() * 10).toFixed(2)}%`,
      bidSuccess: 300000 + Math.floor(Math.random() * 150000),
      bidSuccessRate: `${(70 + Math.random() * 15).toFixed(2)}%`,
      impressions: 200000 + Math.floor(Math.random() * 100000),
      winShowRate: `${(60 + Math.random() * 20).toFixed(2)}%`,
      clicks: 1000 + Math.floor(Math.random() * 800),
      ctr: `${(0.3 + Math.random() * 0.4).toFixed(2)}%`,
      cpc: 1.5 + Math.random() * 1.5,
    });
  }
  return rows.reverse();
}

export default function HourlyReport() {
  const [queryDate, setQueryDate] = useState<dayjs.Dayjs>(dayjs());
  const [dataMetric, setDataMetric] = useState('revenuePerMille');

  const tableData = useMemo(() => generateHourlyData(), []);

  const totalRow: TableRow = useMemo(() => {
    const total = tableData.reduce(
      (acc, row) => ({
        estimatedIncome: acc.estimatedIncome + row.estimatedIncome,
        requests: acc.requests + row.requests,
        bidSuccess: acc.bidSuccess + row.bidSuccess,
        impressions: acc.impressions + row.impressions,
        clicks: acc.clicks + row.clicks,
      }),
      { estimatedIncome: 0, requests: 0, bidSuccess: 0, impressions: 0, clicks: 0 }
    );
    return {
      key: 'total',
      date: '总计',
      hour: '',
      revenuePerMille: 125.8,
      estimatedIncome: total.estimatedIncome,
      ecpm: 9.15,
      requestValuePerMille: 98.5,
      requests: total.requests,
      returnRate: '85.32%',
      bidSuccess: total.bidSuccess,
      bidSuccessRate: '76.05%',
      impressions: total.impressions,
      winShowRate: '72.50%',
      clicks: total.clicks,
      ctr: '0.50%',
      cpc: 2.01,
    };
  }, [tableData]);

  const displayData = [totalRow, ...tableData];

  const chartLabels = Array.from({ length: 24 }, (_, i) => {
    const h = i.toString().padStart(2, '0');
    return `${h}:00-${h}:59`;
  });

  const getMetricValue = (row: TableRow): number => {
    switch (dataMetric) {
      case 'revenuePerMille': return row.revenuePerMille;
      case 'estimatedIncome': return row.estimatedIncome;
      case 'ecpm': return row.ecpm;
      case 'requestValuePerMille': return row.requestValuePerMille;
      case 'requests': return row.requests;
      case 'returnRate': return parseFloat(row.returnRate);
      case 'bidSuccess': return row.bidSuccess;
      case 'bidSuccessRate': return parseFloat(row.bidSuccessRate);
      case 'impressions': return row.impressions;
      case 'winShowRate': return parseFloat(row.winShowRate);
      case 'clicks': return row.clicks;
      case 'ctr': return parseFloat(row.ctr);
      case 'cpc': return row.cpc;
      default: return row.revenuePerMille;
    }
  };

  const chartValues = tableData.map((r) => getMetricValue(r)).reverse();
  const maxVal = Math.max(...chartValues);
  const minVal = Math.min(...chartValues);
  const range = maxVal - minVal || 1;

  const currentMetricLabel = metricOptions.find((o) => o.value === dataMetric)?.label || '千人均收益';

  const columns: ColumnsType<TableRow> = [
    { title: '日期', dataIndex: 'date', key: 'date', width: 110, align: 'center' },
    { title: '小时', dataIndex: 'hour', key: 'hour', width: 100, align: 'center' },
    { title: '千人均收益', dataIndex: 'revenuePerMille', key: 'revenuePerMille', width: 110, align: 'right', render: (v: number) => v.toFixed(2) },
    { title: '预估收入', dataIndex: 'estimatedIncome', key: 'estimatedIncome', width: 120, align: 'right', render: (v: number) => v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) },
    { title: 'eCPM', dataIndex: 'ecpm', key: 'ecpm', width: 90, align: 'right', render: (v: number) => v.toFixed(2) },
    { title: '千次请求价值', dataIndex: 'requestValuePerMille', key: 'requestValuePerMille', width: 120, align: 'right', render: (v: number) => v.toFixed(2) },
    { title: '请求量', dataIndex: 'requests', key: 'requests', width: 100, align: 'right', render: (v: number) => v.toLocaleString() },
    { title: '返回率', dataIndex: 'returnRate', key: 'returnRate', width: 90, align: 'right' },
    { title: '竞价成功数', dataIndex: 'bidSuccess', key: 'bidSuccess', width: 110, align: 'right', render: (v: number) => v.toLocaleString() },
    { title: '竞价成功率', dataIndex: 'bidSuccessRate', key: 'bidSuccessRate', width: 110, align: 'right' },
    { title: '展示量', dataIndex: 'impressions', key: 'impressions', width: 100, align: 'right', render: (v: number) => v.toLocaleString() },
    { title: '竞胜展示率', dataIndex: 'winShowRate', key: 'winShowRate', width: 110, align: 'right' },
    { title: '点击数', dataIndex: 'clicks', key: 'clicks', width: 90, align: 'right', render: (v: number) => v.toLocaleString() },
    { title: '点击率', dataIndex: 'ctr', key: 'ctr', width: 90, align: 'right' },
    { title: 'cpc', dataIndex: 'cpc', key: 'cpc', width: 80, align: 'right', render: (v: number) => v.toFixed(2) },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, fontSize: 16, fontWeight: 500 }}>分小时报表</div>

      {/* 日期选择器 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col>
          <DatePicker
            value={queryDate}
            onChange={(d) => d && setQueryDate(d)}
            format="YYYY-MM-DD"
            allowClear={false}
            disabledDate={(current) => {
              return current && current > dayjs().endOf('day');
            }}
          />
        </Col>
      </Row>

      {/* 数据图表 */}
      <Card
        size="small"
        title={
          <Space>
            <span role="img" aria-label="chart" style={{ fontSize: 14 }}>
              📊
            </span>
            <span>数据图表</span>
          </Space>
        }
        extra={
          <Space>
            <span style={{ fontSize: 12, color: '#666' }}>数据指标</span>
            <Select
              value={dataMetric}
              onChange={setDataMetric}
              size="small"
              style={{ width: 140 }}
              options={metricOptions}
            />
          </Space>
        }
        style={{ marginBottom: 16 }}
      >
        <div style={{ fontSize: 11, color: '#999', marginBottom: 4 }}>{currentMetricLabel}</div>

        <div style={{ display: 'flex', height: 240 }}>
          <div
            style={{
              width: 50,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              paddingRight: 6,
              fontSize: 11,
              color: '#999',
            }}
          >
            <span>{maxVal > 100 ? Math.ceil(maxVal).toLocaleString() : maxVal.toFixed(2)}</span>
            <span>{((maxVal + minVal) / 2).toFixed(2)}</span>
            <span>{minVal > 100 ? Math.floor(minVal).toLocaleString() : minVal.toFixed(2)}</span>
          </div>

          <div
            style={{
              flex: 1,
              position: 'relative',
              borderLeft: '1px solid #e8e8e8',
              borderBottom: '1px solid #e8e8e8',
            }}
          >
            <div
              style={{ position: 'absolute', top: '0%', left: 0, right: 0, height: 1, background: '#f0f0f0' }}
            />
            <div
              style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: '#f0f0f0' }}
            />

            <svg
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'visible' }}
            >
              <polyline
                fill="none"
                stroke="#1890ff"
                strokeWidth={2}
                points={chartValues
                  .map((v, i) => {
                    const x = (i / (chartValues.length - 1)) * 100;
                    const y = 100 - ((v - minVal) / range) * 100;
                    return `${x}% ${y}%`;
                  })
                  .join(', ')}
              />
              {chartValues.map((v, i) => {
                const x = (i / (chartValues.length - 1)) * 100;
                const y = 100 - ((v - minVal) / range) * 100;
                return <circle key={i} cx={`${x}%`} cy={`${y}%`} r={3} fill="#1890ff" />;
              })}
            </svg>

            <div
              style={{
                position: 'absolute',
                bottom: -28,
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 10,
                color: '#999',
              }}
            >
              {chartLabels.map((label, i) => (
                <span
                  key={label}
                  style={{
                    transform: 'rotate(-45deg)',
                    transformOrigin: 'top left',
                    whiteSpace: 'nowrap',
                    display: i % 2 === 0 ? 'inline' : 'none',
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 36, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
            <span style={{ width: 12, height: 3, background: '#1890ff', borderRadius: 2, display: 'inline-block' }} />
            <span>{currentMetricLabel}</span>
          </div>
          <div style={{ flex: 1, height: 24, background: '#f5f5f5', borderRadius: 2, position: 'relative', overflow: 'hidden' }}>
            <svg style={{ width: '100%', height: '100%' }} preserveAspectRatio="none" viewBox={`0 0 ${chartValues.length} 100`}>
              <polyline
                fill="none"
                stroke="#1890ff"
                strokeWidth={1}
                points={chartValues.map((v, i) => `${i},${100 - ((v - minVal) / range) * 100}`).join(' ')}
              />
            </svg>
          </div>
        </div>
      </Card>

      {/* 数据表格 */}
      <Table
        size="small"
        bordered
        pagination={false}
        dataSource={displayData}
        columns={columns}
        scroll={{ x: 'max-content' }}
        rowClassName={(record) => (record.key === 'total' ? 'total-row' : '')}
      />

      <style>{`
        .total-row td {
          background: #fafafa !important;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
