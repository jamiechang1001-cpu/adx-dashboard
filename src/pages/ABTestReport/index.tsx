import { useState, useMemo } from 'react';
import {
  Tabs,
  Table,
  Select,
  DatePicker,
  Tag,
  Card,
  Space,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

interface DataRow {
  key: string;
  group: string;
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

const mockTableData: DataRow[] = [
  {
    key: 'a',
    group: 'A(对照组)',
    revenuePerMille: 125.8,
    estimatedIncome: 158240.5,
    ecpm: 8.52,
    requestValuePerMille: 98.5,
    requests: 20044000,
    returnRate: '85.3%',
    bidSuccess: 15234000,
    bidSuccessRate: '76.0%',
    impressions: 15730000,
    winShowRate: '72.5%',
    clicks: 78650,
    ctr: '0.50%',
    cpc: 2.01,
  },
  {
    key: 'b',
    group: 'B(测试组)',
    revenuePerMille: 138.2,
    estimatedIncome: 173910.8,
    ecpm: 9.15,
    requestValuePerMille: 105.2,
    requests: 20331600,
    returnRate: '87.1%',
    bidSuccess: 15858000,
    bidSuccessRate: '78.0%',
    impressions: 16510800,
    winShowRate: '74.2%',
    clicks: 85806,
    ctr: '0.52%',
    cpc: 2.03,
  },
];

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

function calcChange(a: number | string, b: number | string): string {
  const av = typeof a === 'string' ? parseFloat(a.replace('%', '')) : a;
  const bv = typeof b === 'string' ? parseFloat(b.replace('%', '')) : b;
  if (av === 0) return '-';
  const change = ((bv - av) / av) * 100;
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}%`;
}

function RunningReport() {
  const [chartMetric, setChartMetric] = useState('revenuePerMille');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([dayjs().subtract(7, 'day'), dayjs()]);
  const [selectedGroup, setSelectedGroup] = useState<string>('默认分组');

  const groupOptions = useMemo(() => {
    try {
      const saved = localStorage.getItem('waterfall_scenes');
      if (!saved) return [{ label: '默认分组', value: '默认分组' }];
      const scenes = JSON.parse(saved) as { groups?: { name: string }[] }[];
      const names = new Set<string>();
      scenes.forEach((scene) => {
        scene.groups?.forEach((g) => names.add(g.name));
      });
      const options = Array.from(names).map((name) => ({ label: name, value: name }));
      return options.length > 0 ? options : [{ label: '默认分组', value: '默认分组' }];
    } catch {
      return [{ label: '默认分组', value: '默认分组' }];
    }
  }, []);

  const a = mockTableData[0];
  const b = mockTableData[1];

  const columns: ColumnsType<DataRow> = [
    {
      title: '组别',
      dataIndex: 'group',
      key: 'group',
      width: 110,
      fixed: 'left',
      render: (text: string) => {
        if (text === '对比涨幅') {
          return (
            <Space>
              <Tag color="green">对比</Tag>
              <span>对比涨幅</span>
            </Space>
          );
        }
        const isA = text.includes('A');
        return (
          <Space>
            <Tag color={isA ? 'blue' : 'orange'}>{isA ? 'A' : 'B'}</Tag>
            <span>{isA ? '对照组' : '测试组'}</span>
          </Space>
        );
      },
    },
    { title: '千人均收益', dataIndex: 'revenuePerMille', key: 'revenuePerMille', width: 110, align: 'right' },
    { title: '预估收入', dataIndex: 'estimatedIncome', key: 'estimatedIncome', width: 120, align: 'right', render: (v: number) => v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) },
    { title: 'eCPM', dataIndex: 'ecpm', key: 'ecpm', width: 90, align: 'right' },
    { title: '千次请求价值', dataIndex: 'requestValuePerMille', key: 'requestValuePerMille', width: 120, align: 'right' },
    { title: '请求量', dataIndex: 'requests', key: 'requests', width: 100, align: 'right', render: (v: number) => v.toLocaleString() },
    { title: '返回率', dataIndex: 'returnRate', key: 'returnRate', width: 90, align: 'right' },
    { title: '竞价成功数', dataIndex: 'bidSuccess', key: 'bidSuccess', width: 110, align: 'right', render: (v: number) => v.toLocaleString() },
    { title: '竞价成功率', dataIndex: 'bidSuccessRate', key: 'bidSuccessRate', width: 110, align: 'right' },
    { title: '展示量', dataIndex: 'impressions', key: 'impressions', width: 100, align: 'right', render: (v: number) => v.toLocaleString() },
    { title: '竞胜展示率', dataIndex: 'winShowRate', key: 'winShowRate', width: 110, align: 'right' },
    { title: '点击数', dataIndex: 'clicks', key: 'clicks', width: 90, align: 'right', render: (v: number) => v.toLocaleString() },
    { title: '点击率', dataIndex: 'ctr', key: 'ctr', width: 90, align: 'right' },
    { title: 'cpc', dataIndex: 'cpc', key: 'cpc', width: 80, align: 'right' },
  ];

  const summaryRow = {
    key: 'change',
    group: '对比涨幅',
    revenuePerMille: calcChange(a.revenuePerMille, b.revenuePerMille),
    estimatedIncome: calcChange(a.estimatedIncome, b.estimatedIncome),
    ecpm: calcChange(a.ecpm, b.ecpm),
    requestValuePerMille: calcChange(a.requestValuePerMille, b.requestValuePerMille),
    requests: calcChange(a.requests, b.requests),
    returnRate: calcChange(a.returnRate, b.returnRate),
    bidSuccess: calcChange(a.bidSuccess, b.bidSuccess),
    bidSuccessRate: calcChange(a.bidSuccessRate, b.bidSuccessRate),
    impressions: calcChange(a.impressions, b.impressions),
    winShowRate: calcChange(a.winShowRate, b.winShowRate),
    clicks: calcChange(a.clicks, b.clicks),
    ctr: calcChange(a.ctr, b.ctr),
    cpc: calcChange(a.cpc, b.cpc),
  };

  const tableDataWithSummary = [...mockTableData, summaryRow as unknown as DataRow];

  // Mock chart data points (千人均收益)
  const days = 8;
  const chartLabels = Array.from({ length: days }, (_, i) =>
    dayjs().subtract(days - 1 - i, 'day').format('MM-DD')
  );

  const chartDataA = [118.5, 120.2, 122.0, 123.8, 121.5, 124.2, 123.0, 125.8];
  const chartDataB = [128.0, 130.5, 132.0, 134.2, 131.8, 135.5, 133.0, 138.2];

  const maxVal = Math.max(...chartDataA, ...chartDataB);
  const minVal = Math.min(...chartDataA, ...chartDataB);
  const range = maxVal - minVal || 1;

  return (
    <div>
      {/* 测试信息 */}
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 24, fontSize: 13 }}>
        <span>
          <span style={{ color: '#666' }}>流量分组：</span>
          <Select
            value={selectedGroup}
            onChange={setSelectedGroup}
            style={{ width: 160 }}
            placeholder="流量分组"
            options={groupOptions}
            size="small"
          />
        </span>
        <span>
          <span style={{ color: '#666' }}>测试名称：</span>
          <span style={{ fontWeight: 500 }}>瀑布流广告位eCPM优化测试</span>
        </span>
        <span>
          <span style={{ color: '#666' }}>生效时间：</span>
          <span>2026-01-22 11:24:43 ~ 2026-02-02 10:40:22</span>
        </span>
        <Tag color="processing">运行中</Tag>
      </div>

      {/* 数据表格 */}
      <Card title="A/B测试数据对比" size="small" style={{ marginBottom: 16 }}>
        <Table
          size="small"
          bordered
          pagination={false}
          dataSource={tableDataWithSummary}
          columns={columns}
          scroll={{ x: 'max-content' }}
          rowClassName={(record) => {
            if (record.key === 'change') return 'change-row';
            return '';
          }}
        />
      </Card>

      {/* A/B测试图表区域 */}
      <Card
        title="A/B测试图表"
        size="small"
        extra={
          <Space>
            <Select
              value={chartMetric}
              onChange={setChartMetric}
              style={{ width: 140 }}
              options={metricOptions}
              size="small"
            />
            <RangePicker
              value={dateRange}
              onChange={(vals) => {
                if (vals && vals[0] && vals[1]) {
                  setDateRange([vals[0], vals[1]]);
                }
              }}
              format="YYYY-MM-DD"
              allowClear={false}
              size="small"
              style={{ width: 220 }}
            />
          </Space>
        }
      >
        {/* 图例 */}
        <div style={{ display: 'flex', gap: 24, marginBottom: 12, fontSize: 13 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 12, height: 3, background: '#1890ff', borderRadius: 2, display: 'inline-block' }} />
            <span>A对照组</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 12, height: 3, background: '#fa8c16', borderRadius: 2, display: 'inline-block' }} />
            <span>B测试组</span>
          </div>
        </div>

        {/* 模拟折线图 */}
        <div style={{ display: 'flex', height: 280 }}>
          {/* Y轴 */}
          <div style={{ width: 50, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end', paddingRight: 8, fontSize: 11, color: '#999' }}>
            <span>{maxVal.toFixed(1)}</span>
            <span>{((maxVal + minVal) / 2).toFixed(1)}</span>
            <span>{minVal.toFixed(1)}</span>
          </div>

          {/* 图表区域 */}
          <div style={{ flex: 1, position: 'relative', borderLeft: '1px solid #e8e8e8', borderBottom: '1px solid #e8e8e8' }}>
            {/* 网格线 */}
            <div style={{ position: 'absolute', top: '0%', left: 0, right: 0, height: 1, background: '#f0f0f0' }} />
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: '#f0f0f0' }} />

            {/* A/B组折线 */}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'visible' }}>
              {/* A组折线 */}
              <polyline
                fill="none"
                stroke="#1890ff"
                strokeWidth={0.8}
                points={chartDataA.map((v, i) => {
                  const x = (i / (days - 1)) * 100;
                  const y = 100 - ((v - minVal) / range) * 100;
                  return `${x},${y}`;
                }).join(' ')}
              />
              {chartDataA.map((v, i) => {
                const x = (i / (days - 1)) * 100;
                const y = 100 - ((v - minVal) / range) * 100;
                return (
                  <circle key={`a-${i}`} cx={x} cy={y} r={1.2} fill="#1890ff" />
                );
              })}
              {/* B组折线 */}
              <polyline
                fill="none"
                stroke="#fa8c16"
                strokeWidth={0.8}
                points={chartDataB.map((v, i) => {
                  const x = (i / (days - 1)) * 100;
                  const y = 100 - ((v - minVal) / range) * 100;
                  return `${x},${y}`;
                }).join(' ')}
              />
              {chartDataB.map((v, i) => {
                const x = (i / (days - 1)) * 100;
                const y = 100 - ((v - minVal) / range) * 100;
                return (
                  <circle key={`b-${i}`} cx={x} cy={y} r={1.2} fill="#fa8c16" />
                );
              })}
            </svg>

            {/* X轴标签 */}
            <div style={{ position: 'absolute', bottom: -24, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#999' }}>
              {chartLabels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* 数据明细 */}
      <Card title={`数据明细 - ${metricOptions.find((o) => o.value === chartMetric)?.label || '千人均收益'}`} size="small" style={{ marginBottom: 16 }}>
        <Table
          size="small"
          bordered
          pagination={false}
          dataSource={chartLabels.map((date, i) => ({
            key: date,
            date,
            valueA: chartDataA[i],
            valueB: chartDataB[i],
            change: calcChange(chartDataA[i], chartDataB[i]),
          }))}
          columns={[
            { title: '日期', dataIndex: 'date', key: 'date', width: 100, align: 'center' },
            { title: 'A对照组', dataIndex: 'valueA', key: 'valueA', width: 120, align: 'right', render: (v: number) => v.toFixed(2) },
            { title: 'B测试组', dataIndex: 'valueB', key: 'valueB', width: 120, align: 'right', render: (v: number) => v.toFixed(2) },
            { title: '对比涨幅', dataIndex: 'change', key: 'change', width: 120, align: 'right', render: (v: string) => <span style={{ color: v.startsWith('+') ? '#52c41a' : v.startsWith('-') ? '#ff4d4f' : undefined }}>{v}</span> },
          ]}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      <style>{`
        .change-row td {
          background: #f6ffed !important;
          font-weight: 500;
          color: #52c41a;
        }
      `}</style>
    </div>
  );
}

export default function ABTestReport() {
  const [activeTab, setActiveTab] = useState('running');

  return (
    <div>
      <div style={{ marginBottom: 16, fontSize: 16, fontWeight: 500 }}>A/B实验报表</div>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'running',
            label: '运行中A/B测试组',
            children: <RunningReport />,
          },
          {
            key: 'ended',
            label: '已结束A/B测试组',
            children: (
              <div style={{ textAlign: 'center', padding: '80px 0', color: '#999' }}>
                <div style={{ fontSize: 16 }}>暂无已结束的A/B测试组</div>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
