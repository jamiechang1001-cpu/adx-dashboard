import React, { useState } from 'react';
import {
  Breadcrumb,
  Button,
  Card,
  Table,
  Tag,
  Space,
  Modal,
  message,
  Form,
  Input,
  Select,
  Radio,
  Switch,
} from 'antd';
import {
  HomeOutlined,
  CloseOutlined,
} from '@ant-design/icons';

interface AdSlot {
  id: string;
  slotId: string;
  platform: string;
  scene: string;
  adPosition: string;
  boundGroup: string;
  status: 'active' | 'closed';
}

const mockData: AdSlot[] = [
  {
    id: '1',
    slotId: '10001',
    platform: '安卓',
    scene: '开屏',
    adPosition: '1000-开屏',
    boundGroup: '1 - 新用户分组',
    status: 'active',
  },
  {
    id: '2',
    slotId: '10002',
    platform: 'iOS',
    scene: '激励视频',
    adPosition: '1001-激励视频',
    boundGroup: '2 - 高活跃用户',
    status: 'active',
  },
  {
    id: '3',
    slotId: '10003',
    platform: '安卓',
    scene: '插屏',
    adPosition: '1002-插屏',
    boundGroup: '默认分组',
    status: 'active',
  },
  {
    id: '4',
    slotId: '10004',
    platform: 'iOS',
    scene: '信息流',
    adPosition: '1003-信息流',
    boundGroup: '3 - 留存用户',
    status: 'closed',
  },
  {
    id: '5',
    slotId: '10005',
    platform: '安卓',
    scene: '开屏',
    adPosition: '1000-开屏',
    boundGroup: '默认分组',
    status: 'active',
  },
];

const AdSlotMgmt: React.FC = () => {
  const [dataSource, setDataSource] = useState<AdSlot[]>(mockData);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addForm] = Form.useForm();

  const handleAddSlot = () => {
    addForm.resetFields();
    setAddModalVisible(true);
  };

  const handleAddSubmit = async () => {
    try {
      const values = await addForm.validateFields();
      const newSlot: AdSlot = {
        id: `slot-${Date.now()}`,
        slotId: values.slotId,
        platform: values.platform,
        scene: values.scene,
        adPosition: values.adPosition,
        boundGroup: values.boundGroup || '默认分组',
        status: values.status ? 'active' : 'closed',
      };
      setDataSource((prev) => [newSlot, ...prev]);
      setAddModalVisible(false);
      message.success('代码位新增成功');
    } catch {
      // validation failed
    }
  };

  const handleAddCancel = () => {
    setAddModalVisible(false);
  };

  const handleCloseSlot = (record: AdSlot) => {
    Modal.confirm({
      title: '确认关闭',
      content: `确定要关闭广告代码位 ${record.slotId} 吗？`,
      onOk: () => {
        setDataSource((prev) =>
          prev.map((item) =>
            item.id === record.id ? { ...item, status: 'closed' } : item
          )
        );
        message.success(`广告代码位 ${record.slotId} 已关闭`);
      },
    });
  };

  const columns = [
    {
      title: '代码位Id',
      dataIndex: 'slotId',
      key: 'slotId',
      width: 120,
    },
    {
      title: '系统平台',
      dataIndex: 'platform',
      key: 'platform',
      width: 100,
      render: (platform: string) => (
        <Tag color={platform === '安卓' ? 'blue' : 'purple'}>{platform}</Tag>
      ),
    },
    {
      title: '广告场景',
      dataIndex: 'scene',
      key: 'scene',
      width: 120,
    },
    {
      title: '广告位',
      dataIndex: 'adPosition',
      key: 'adPosition',
      width: 140,
    },
    {
      title: '绑定分组信息',
      dataIndex: 'boundGroup',
      key: 'boundGroup',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (_: any, record: AdSlot) => (
        <Space>
          {record.status === 'active' ? (
            <Button
              type="link"
              danger
              size="small"
              icon={<CloseOutlined />}
              onClick={() => handleCloseSlot(record)}
            >
              关闭广告代码位Id
            </Button>
          ) : (
            <Tag color="default">已关闭</Tag>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item><HomeOutlined /></Breadcrumb.Item>
        <Breadcrumb.Item>流量管理</Breadcrumb.Item>
        <Breadcrumb.Item>代码位ID管理</Breadcrumb.Item>
      </Breadcrumb>

      <Card
        title="代码位列表"
        extra={
          <Button type="primary" onClick={handleAddSlot}>新增代码位</Button>
        }
      >
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
          size="middle"
          bordered={false}
        />
      </Card>

      {/* 新增代码位弹窗 */}
      <Modal
        title="新增代码位"
        open={addModalVisible}
        onOk={handleAddSubmit}
        onCancel={handleAddCancel}
        okText="提交"
        cancelText="取消"
        width={560}
      >
        <Form
          form={addForm}
          layout="horizontal"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
          style={{ marginTop: 24 }}
        >
          <Form.Item
            label="系统平台"
            name="platform"
            rules={[{ required: true, message: '请选择系统平台' }]}
          >
            <Select
              placeholder="请选择系统平台"
              options={[
                { label: '安卓', value: '安卓' },
                { label: 'iOS', value: 'iOS' },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="DSP来源"
            name="dspSource"
            rules={[{ required: true, message: '请选择DSP来源' }]}
          >
            <Select
              placeholder="请选择DSP来源"
              options={[
                { label: '穿山甲SDK', value: '穿山甲SDK' },
                { label: '优量汇SDK', value: '优量汇SDK' },
                { label: '百度SDK', value: '百度SDK' },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="广告场景"
            name="scene"
            rules={[{ required: true, message: '请选择广告场景' }]}
          >
            <Select
              placeholder="请选择广告场景"
              options={[
                { label: '开屏', value: '开屏' },
                { label: '激励视频', value: '激励视频' },
                { label: '插屏', value: '插屏' },
                { label: '信息流', value: '信息流' },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="广告位"
            name="adPosition"
            rules={[{ required: true, message: '请选择广告位' }]}
          >
            <Select
              placeholder="请选择广告位"
              options={[
                { label: '1000-开屏', value: '1000-开屏' },
                { label: '1001-激励视频', value: '1001-激励视频' },
                { label: '1002-插屏', value: '1002-插屏' },
                { label: '1003-信息流', value: '1003-信息流' },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="名称"
            name="name"
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input placeholder="请输入名称" maxLength={30} showCount />
          </Form.Item>

          <Form.Item
            label="代码位ID"
            name="slotId"
            rules={[{ required: true, message: '请输入代码位ID' }]}
          >
            <Input placeholder="请输入代码位ID" />
          </Form.Item>

          <Form.Item
            label="价格模式"
            name="pricingMode"
            initialValue="bid"
            rules={[{ required: true, message: '请选择价格模式' }]}
          >
            <Radio.Group>
              <Radio value="bid">竞价</Radio>
              <Radio value="fixed">定价</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="状态"
            name="status"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdSlotMgmt;
