import React, { useState, useMemo, useEffect, useReducer } from 'react';
import dayjs from 'dayjs';
import {
  Breadcrumb,
  Button,
  Card,
  Tabs,
  Tag,
  Switch,
  InputNumber,
  Table,
  Tooltip,
  Dropdown,
  Space,
  Modal,
  message,
  Checkbox,
  Collapse,
  Form,
  Input,
  Select,
  Row,
  Col,
  Radio,
  Segmented,
  DatePicker,
} from 'antd';
import type { MenuProps, TabsProps } from 'antd';
import {
  HomeOutlined,
  PlusOutlined,
  AppstoreAddOutlined,
  MoreOutlined,
  QuestionCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ExperimentOutlined,
  LineChartOutlined,
} from '@ant-design/icons';

// ==================== Types ====================

interface AdSource {
  id: string;
  name: string;
  network: string;
  networkIcon: string;
  platform: string;
  dspSource: string;
  pid: string;
  adUnitId: string;
  isFallback: boolean;
  pricingType: 'bid' | 'fixed';
  price: number;
  enabled: boolean;
  stats: {
    estimatedRevenue: number;
    ecpm: number;
    requestValue: number;
    requests: number;
    returns: number;
    returnRate: string;
    bidWins: number;
    winRate: string;
  };
}

interface GroupRule {
  dimension: string;
  operator: string;
  values: string[];
}

interface WaterfallGroup {
  id: string;
  name: string;
  isDefault: boolean;
  enabled: boolean;
  floorPrice: number | null;
  floorPriceEnabled: boolean;
  rules: GroupRule[];
  adSources: AdSource[];
  priority?: number;
  abTest?: boolean;
}

interface AdScene {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
  groups: WaterfallGroup[];
}

// ==================== Mock Data ====================

const mockScenes: AdScene[] = [
  {
    id: 'splash',
    name: '开屏',
    icon: '📱',
    enabled: true,
    groups: [
      {
        id: 'g-default',
        name: '默认分组',
        isDefault: true,
        enabled: true,
        floorPrice: null,
        floorPriceEnabled: false,
        rules: [],
        adSources: [
          {
            id: 's1',
            name: '穿山甲原生测试',
            network: '穿山甲SDK',
            networkIcon: '🟢',
            platform: '安卓',
            dspSource: '穿山甲SDK',
            pid: '6201288647035419',
            adUnitId: '63412888',
            isFallback: false,
            pricingType: 'bid',
            price: 16.33,
            enabled: true,
            stats: {
              estimatedRevenue: 11234.56,
              ecpm: 14.56,
              requestValue: 0.56,
              requests: 120000,
              returns: 60000,
              returnRate: '50.00%',
              bidWins: 20000,
              winRate: '50.00%',
            },
          },
          {
            id: 's2',
            name: '优量汇SDK',
            network: '优量汇SDK',
            networkIcon: '🔵',
            platform: '安卓',
            dspSource: '优量汇SDK',
            pid: '6201288647035420',
            adUnitId: '63412889',
            isFallback: false,
            pricingType: 'fixed',
            price: 16.32,
            enabled: true,
            stats: {
              estimatedRevenue: 11234.56,
              ecpm: 14.56,
              requestValue: 0.56,
              requests: 120000,
              returns: 60000,
              returnRate: '50.00%',
              bidWins: 20000,
              winRate: '50.00%',
            },
          },
          {
            id: 's3',
            name: '优量汇SDK兜底',
            network: '优量汇SDK',
            networkIcon: '🔵',
            platform: '安卓',
            dspSource: '优量汇SDK',
            pid: '6201288647035421',
            adUnitId: '63412890',
            isFallback: true,
            pricingType: 'bid',
            price: 0.66,
            enabled: true,
            stats: {
              estimatedRevenue: 11234.56,
              ecpm: 14.56,
              requestValue: 0.56,
              requests: 120000,
              returns: 60000,
              returnRate: '50.00%',
              bidWins: 20000,
              winRate: '50.00%',
            },
          },
          {
            id: 's4',
            name: '优量汇SDK兜底',
            network: '优量汇SDK',
            networkIcon: '🔵',
            platform: '安卓',
            dspSource: '优量汇SDK',
            pid: '6201288647035422',
            adUnitId: '63412891',
            isFallback: false,
            pricingType: 'bid',
            price: 0.66,
            enabled: false,
            stats: {
              estimatedRevenue: 0,
              ecpm: 0,
              requestValue: 0,
              requests: 0,
              returns: 0,
              returnRate: '0.00%',
              bidWins: 0,
              winRate: '0.00%',
            },
          },
          {
            id: 's5',
            name: '优量汇SDK兜底',
            network: '优量汇SDK',
            networkIcon: '🔵',
            platform: '安卓',
            dspSource: '优量汇SDK',
            pid: '6201288647035423',
            adUnitId: '63412892',
            isFallback: false,
            pricingType: 'bid',
            price: 0.66,
            enabled: false,
            stats: {
              estimatedRevenue: 0,
              ecpm: 0,
              requestValue: 0,
              requests: 0,
              returns: 0,
              returnRate: '0.00%',
              bidWins: 0,
              winRate: '0.00%',
            },
          },
          {
            id: 's6',
            name: '优量汇SDK兜底',
            network: '优量汇SDK',
            networkIcon: '🔵',
            platform: '安卓',
            dspSource: '优量汇SDK',
            pid: '6201288647035424',
            adUnitId: '63412893',
            isFallback: false,
            pricingType: 'bid',
            price: 0.66,
            enabled: false,
            stats: {
              estimatedRevenue: 0,
              ecpm: 0,
              requestValue: 0,
              requests: 0,
              returns: 0,
              returnRate: '0.00%',
              bidWins: 0,
              winRate: '0.00%',
            },
          },
        ],
      },
      {
        id: 'g-test1',
        name: '分组测试1',
        isDefault: false,
        enabled: true,
        floorPrice: null,
        floorPriceEnabled: false,
        priority: 1,
        rules: [
          { dimension: '平台', operator: '包含', values: ['安卓'] },
          { dimension: '广告位', operator: '包含', values: ['1000-开屏'] },
        ],
        adSources: [],
      },
      {
        id: 'g-test2',
        name: '分组测试2',
        isDefault: false,
        enabled: true,
        floorPrice: 5,
        floorPriceEnabled: true,
        priority: 2,
        rules: [
          { dimension: '身份', operator: '包含', values: ['经期', '备孕', '怀孕'] },
        ],
        adSources: [],
      },
    ],
  },
  { id: 'interstitial', name: '插屏', icon: '🖼️', enabled: true, groups: [] },
  { id: 'native', name: '信息流', icon: '📰', enabled: true, groups: [] },
];

// ==================== Components ====================

const AdSceneSelector: React.FC<{
  scenes: AdScene[];
  activeSceneId: string;
  onChange: (id: string) => void;
}> = ({ scenes, activeSceneId, onChange }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ color: '#262626', fontSize: 14 }}>广告场景：</span>
      <Select
        value={activeSceneId}
        onChange={onChange}
        style={{ width: 200 }}
        options={scenes.map((scene) => ({
          label: `${scene.icon} ${scene.name}`,
          value: scene.id,
          disabled: !scene.enabled,
        }))}
      />
    </div>
  );
};

const GroupRules: React.FC<{ rules: GroupRule[] }> = ({ rules }) => {
  if (rules.length === 0) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
      <Tag color="blue" style={{ marginRight: 0 }}>分组规则</Tag>
      {rules.map((rule, idx) => (
        <Tag key={idx} style={{ background: '#f5f5f5', borderColor: '#d9d9d9', color: '#595959' }}>
          {rule.dimension} {rule.operator} {rule.values.join('、')}
        </Tag>
      ))}
    </div>
  );
};

const Waterfall: React.FC = () => {
  const [scenes, setScenes] = useState<AdScene[]>(() => {
    try {
      const saved = localStorage.getItem('waterfall_scenes');
      return saved ? JSON.parse(saved) : mockScenes;
    } catch {
      return mockScenes;
    }
  });
  const [activeSceneId, setActiveSceneId] = useState(() => {
    try {
      return localStorage.getItem('waterfall_activeSceneId') || 'splash';
    } catch {
      return 'splash';
    }
  });
  const [activeGroupId, setActiveGroupId] = useState(() => {
    try {
      const saved = localStorage.getItem('waterfall_activeGroupId');
      if (saved) return saved;
    } catch { /* empty */ }
    const firstScene = mockScenes[0];
    const firstNonDefault = firstScene?.groups.find((g) => !g.isDefault);
    return firstNonDefault?.id || firstScene?.groups[0]?.id || '';
  });
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([dayjs(), dayjs()]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [groupEnabledMap, setGroupEnabledMap] = useState<Record<string, boolean>>({});
  const [floorPriceEnabledMap, setFloorPriceEnabledMap] = useState<Record<string, boolean>>({});
  const [floorPriceMap, setFloorPriceMap] = useState<Record<string, number | null>>({});
  const [adSourceEnabledMap, setAdSourceEnabledMap] = useState<Record<string, boolean>>({});
  const [addGroupModalVisible, setAddGroupModalVisible] = useState(false);
  const [addGroupForm] = Form.useForm();
  const [addAdSourceModalVisible, setAddAdSourceModalVisible] = useState(false);
  const [addAdSourceForm] = Form.useForm();
  const [pricingMode, setPricingMode] = useState<'bid' | 'fixed'>('bid');
  const [batchManageVisible, setBatchManageVisible] = useState(false);
  const [batchManageFilter, setBatchManageFilter] = useState<'enabled' | 'disabled'>('enabled');
  const [batchManageSelectedKeys, setBatchManageSelectedKeys] = useState<React.Key[]>([]);
  const [batchFloorPriceVisible, setBatchFloorPriceVisible] = useState(false);
  const [batchFloorPriceForm] = Form.useForm();
  const [editGroupModalVisible, setEditGroupModalVisible] = useState(false);
  const [editGroupForm] = Form.useForm();
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [abTestModalVisible, setAbTestModalVisible] = useState(false);
  const [abTestForm] = Form.useForm();
  const [abTestTargetGroup, setAbTestTargetGroup] = useState('');
  const [abTestStep, setAbTestStep] = useState(1);
  const [addAdSourceTargetGroupId, setAddAdSourceTargetGroupId] = useState('');
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);

  // 持久化 scenes 到 sessionStorage
  useEffect(() => {
    localStorage.setItem('waterfall_scenes', JSON.stringify(scenes));
  }, [scenes]);
  // 持久化当前选中的场景和分组
  useEffect(() => {
    localStorage.setItem('waterfall_activeSceneId', activeSceneId);
  }, [activeSceneId]);
  useEffect(() => {
    localStorage.setItem('waterfall_activeGroupId', activeGroupId);
  }, [activeGroupId]);
  const [editingPriceValue, setEditingPriceValue] = useState<number>(0);
  const [trafficDataModalVisible, setTrafficDataModalVisible] = useState(false);
  const [abTestDataModalVisible, setAbTestDataModalVisible] = useState(false);
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);
  const [dataMetricTab, setDataMetricTab] = useState('chart');
  const [deuMetric, setDeuMetric] = useState('千人均收益');

  const activeScene = useMemo(
    () => scenes.find((s) => s.id === activeSceneId) || scenes[0],
    [scenes, activeSceneId]
  );

  const activeGroup = useMemo(
    () => activeScene.groups.find((g) => g.id === activeGroupId) || activeScene.groups[0],
    [activeScene, activeGroupId]
  );

  const enabledSources = useMemo(
    () => activeGroup?.adSources.filter((s) => getAdSourceEnabled(s)) || [],
    [activeGroup, adSourceEnabledMap]
  );

  const disabledSources = useMemo(
    () => activeGroup?.adSources.filter((s) => !getAdSourceEnabled(s)) || [],
    [activeGroup, adSourceEnabledMap]
  );

  function getGroupEnabled(group: WaterfallGroup): boolean {
    return groupEnabledMap[group.id] !== undefined ? groupEnabledMap[group.id] : group.enabled;
  }

  function getFloorPriceEnabled(group: WaterfallGroup): boolean {
    return floorPriceEnabledMap[group.id] !== undefined ? floorPriceEnabledMap[group.id] : group.floorPriceEnabled;
  }

  function getFloorPrice(group: WaterfallGroup): number | null {
    return floorPriceMap[group.id] !== undefined ? floorPriceMap[group.id] : group.floorPrice;
  }

  function getAdSourceEnabled(source: AdSource): boolean {
    return adSourceEnabledMap[source.id] !== undefined ? adSourceEnabledMap[source.id] : source.enabled;
  }

  const handleSceneChange = (id: string) => {
    setActiveSceneId(id);
    const scene = scenes.find((s) => s.id === id);
    if (scene && scene.groups.length > 0) {
      const firstNonDefault = scene.groups.find((g) => !g.isDefault);
      setActiveGroupId(firstNonDefault?.id || scene.groups[0].id);
    }
    setSelectedRowKeys([]);
  };

  const handleAddGroup = () => {
    addGroupForm.resetFields();
    setAddGroupModalVisible(true);
  };

  const handleAddGroupSubmit = async () => {
    try {
      const values = await addGroupForm.validateFields();
      const maxPriority = activeScene.groups
        .filter((g) => !g.isDefault)
        .reduce((max, g) => Math.max(max, g.priority || 0), 0);
      const newGroup: WaterfallGroup = {
        id: `g-${Date.now()}`,
        name: values.groupName,
        isDefault: false,
        enabled: true,
        floorPrice: null,
        floorPriceEnabled: false,
        priority: maxPriority + 1,
        rules: [],
        adSources: [],
      };
      if (values.rules && values.rules.length > 0) {
        newGroup.rules = values.rules
          .filter((r: any) => r.dimension && r.values && r.values.length > 0)
          .map((r: any) => ({
            dimension: r.dimension,
            operator: r.operator || '包含',
            values: r.values,
          }));
      }
      setScenes((prev) =>
        prev.map((scene) =>
          scene.id === activeSceneId
            ? { ...scene, groups: [...scene.groups, newGroup] }
            : scene
        )
      );
      setActiveGroupId(newGroup.id);
      setAddGroupModalVisible(false);
      message.success('分组创建成功');
    } catch {
      // validation failed
    }
  };

  const handleAddGroupCancel = () => {
    setAddGroupModalVisible(false);
  };

  const handleEditGroupSubmit = async () => {
    try {
      const values = await editGroupForm.validateFields();
      if (!editingGroupId) return;
      setScenes((prev) =>
        prev.map((scene) =>
          scene.id === activeSceneId
            ? {
                ...scene,
                groups: scene.groups.map((g) =>
                  g.id === editingGroupId
                    ? {
                        ...g,
                        name: values.groupName,
                        rules: (values.rules || [])
                          .filter((r: any) => r.dimension && r.values && r.values.length > 0)
                          .map((r: any) => ({
                            dimension: r.dimension,
                            operator: r.operator || '包含',
                            values: r.values,
                          })),
                      }
                    : g
                ),
              }
            : scene
        )
      );
      setEditGroupModalVisible(false);
      setEditingGroupId(null);
      message.success('分组更新成功');
    } catch {
      // validation failed
    }
  };

  const handleEditGroupCancel = () => {
    setEditGroupModalVisible(false);
    setEditingGroupId(null);
  };

  const handleCreateABTest = (groupName: string) => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const defaultName = `${groupName}_正式_测试_${dateStr} ${timeStr}`;
    setAbTestTargetGroup(groupName);
    setAbTestStep(1);
    abTestForm.setFieldsValue({
      testName: defaultName,
      controlRatio: 50,
      testRatio: 50,
      copyConfig: true,
    });
    setAbTestModalVisible(true);
  };

  const handleABTestSubmit = async () => {
    try {
      if (abTestStep === 1) {
        await abTestForm.validateFields();
        setAbTestStep(2);
      } else {
        message.success('A/B测试开启成功');
        setScenes((prev) =>
          prev.map((scene) =>
            scene.id === activeSceneId
              ? {
                  ...scene,
                  groups: scene.groups.map((g) =>
                    g.id === activeGroupId ? { ...g, abTest: true } : g
                  ),
                }
              : scene
          )
        );
        setAbTestModalVisible(false);
        setAbTestStep(1);
      }
    } catch {
      // validation failed
    }
  };

  const handleABTestCancel = () => {
    setAbTestModalVisible(false);
  };

  const dimensionOptions = [
    { label: '应用版本', value: '应用版本' },
    { label: '地区', value: '地区' },
    { label: '平台', value: '平台' },
    { label: '身份', value: '身份' },
    { label: '手机品牌', value: '手机品牌' },
    { label: '是否安装特定APP', value: '是否安装特定APP' },
    { label: '时段', value: '时段' },
    { label: '日期', value: '日期' },
    { label: '小时', value: '小时' },
  ];

  const getDimensionValueOptions = (dimension: string) => {
    switch (dimension) {
      case '应用版本':
        return ['v1.0', 'v2.0', 'v3.0', 'v4.0', 'v5.0'];
      case '地区':
        return ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '西安'];
      case '平台':
        return ['安卓', 'iOS'];
      case '身份':
        return ['经期', '备孕', '怀孕', '育儿'];
      case '手机品牌':
        return ['华为', '小米', 'OPPO', 'vivo', 'iPhone', '三星', '荣耀', '一加'];
      case '是否安装特定APP':
        return ['淘宝', '京东', '拼多多', '美团', '抖音', '快手'];
      case '时段':
        return ['早上(6-12)', '中午(12-14)', '下午(14-18)', '晚上(18-24)', '深夜(0-6)'];
      case '日期':
        return ['工作日', '周末', '节假日'];
      case '小时':
        return Array.from({ length: 24 }, (_, i) => `${i}点`);
      default:
        return [];
    }
  };

  const handleBatchManageGroups = () => {
    setBatchManageFilter('enabled');
    setBatchManageSelectedKeys([]);
    setBatchManageVisible(true);
  };

  const handleBatchManageClose = () => {
    setBatchManageVisible(false);
  };

  const handleBatchFloorPrice = () => {
    if (batchManageSelectedKeys.length === 0) {
      message.warning('请先选择分组');
      return;
    }
    // 获取选中分组的当前底价信息，填充表单
    const selectedGroups = activeScene.groups.filter((g) =>
      batchManageSelectedKeys.includes(g.id)
    );
    const floorPriceValues: Record<string, { enabled: boolean; price: number | null }> = {};
    selectedGroups.forEach((g) => {
      floorPriceValues[g.id] = {
        enabled: g.floorPriceEnabled || false,
        price: g.floorPrice || null,
      };
    });
    batchFloorPriceForm.setFieldsValue({
      floorPriceEnabled: true,
      floorPrice: undefined,
      groupFloorPrices: selectedGroups.map((g) => ({
        groupId: g.id,
        groupName: g.name,
        enabled: g.floorPriceEnabled || false,
        price: g.floorPrice,
      })),
    });
    setBatchFloorPriceVisible(true);
  };

  const handleBatchFloorPriceSubmit = async () => {
    try {
      const values = await batchFloorPriceForm.validateFields();
      const useUniform = values.floorPriceEnabled;
      const uniformPrice = values.floorPrice;
      const groupPrices = values.groupFloorPrices || [];

      setScenes((prev) =>
        prev.map((scene) =>
          scene.id === activeSceneId
            ? {
                ...scene,
                groups: scene.groups.map((g) => {
                  if (!batchManageSelectedKeys.includes(g.id)) return g;
                  if (useUniform) {
                    return {
                      ...g,
                      floorPriceEnabled: true,
                      floorPrice: uniformPrice != null ? Number(uniformPrice) : null,
                    };
                  }
                  const groupPrice = groupPrices.find((gp: any) => gp.groupId === g.id);
                  return {
                    ...g,
                    floorPriceEnabled: groupPrice?.enabled || false,
                    floorPrice: groupPrice?.price != null ? Number(groupPrice.price) : null,
                  };
                }),
              }
            : scene
        )
      );
      setBatchFloorPriceVisible(false);
      message.success('流量底价设置成功');
    } catch {
      // validation failed
    }
  };

  const handleBatchFloorPriceCancel = () => {
    setBatchFloorPriceVisible(false);
  };

  const handleBatchCloseGroups = () => {
    if (batchManageSelectedKeys.length === 0) {
      message.warning('请先选择分组');
      return;
    }
    Modal.confirm({
      title: '确认关闭分组',
      content: `确定要关闭选中的 ${batchManageSelectedKeys.length} 个分组吗？`,
      onOk: () => {
        setScenes((prev) =>
          prev.map((scene) =>
            scene.id === activeSceneId
              ? {
                  ...scene,
                  groups: scene.groups.map((g) =>
                    batchManageSelectedKeys.includes(g.id) && !g.isDefault
                      ? { ...g, enabled: false }
                      : g
                  ),
                }
              : scene
          )
        );
        setGroupEnabledMap((prev) => {
          const next = { ...prev };
          batchManageSelectedKeys.forEach((key) => {
            const group = activeScene.groups.find((g) => g.id === key);
            if (group && !group.isDefault) {
              next[group.id] = false;
            }
          });
          return next;
        });
        setBatchManageSelectedKeys([]);
        message.success('分组关闭成功');
      },
    });
  };

  const handleMoveGroupPriority = (groupId: string, direction: 'up' | 'down') => {
    const nonDefault = activeScene.groups.filter((g) => !g.isDefault);
    const index = nonDefault.findIndex((g) => g.id === groupId);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === nonDefault.length - 1) return;

    const newNonDefault = [...nonDefault];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newNonDefault[index], newNonDefault[targetIndex]] = [newNonDefault[targetIndex], newNonDefault[index]];

    const updatedGroups = newNonDefault.map((g, idx) => ({ ...g, priority: idx + 1 }));
    const defaultGroup = activeScene.groups.find((g) => g.isDefault);

    setScenes((prev) =>
      prev.map((scene) =>
        scene.id === activeSceneId
          ? { ...scene, groups: defaultGroup ? [...updatedGroups, defaultGroup] : updatedGroups }
          : scene
      )
    );
  };

  const handleToggleGroupEnabledInBatch = (group: WaterfallGroup, checked: boolean) => {
    if (group.isDefault && !checked) {
      message.warning('默认分组不能关闭');
      return;
    }
    setGroupEnabledMap((prev) => ({ ...prev, [group.id]: checked }));
    setScenes((prev) =>
      prev.map((scene) =>
        scene.id === activeSceneId
          ? {
              ...scene,
              groups: scene.groups.map((g) =>
                g.id === group.id ? { ...g, enabled: checked } : g
              ),
            }
          : scene
      )
    );
  };

  const handleAddAdSource = () => {
    addAdSourceForm.resetFields();
    setPricingMode('bid');
    addAdSourceForm.setFieldsValue({
      status: true,
      platform: '安卓',
      pricingMode: 'bid',
    });
    setAddAdSourceTargetGroupId(activeGroupId);
    setAddAdSourceModalVisible(true);
  };

  const handleAddAdSourceSubmit = async () => {
    try {
      const values = await addAdSourceForm.validateFields();
      if (editingAdSourceId) {
        // 编辑模式
        setScenes((prev) =>
          prev.map((scene) =>
            scene.id === activeSceneId
              ? {
                  ...scene,
                  groups: scene.groups.map((g) =>
                    g.id === addAdSourceTargetGroupId
                      ? {
                          ...g,
                          adSources: g.adSources.map((s) =>
                            s.id === editingAdSourceId
                              ? {
                                  ...s,
                                  name: values.adSourceName,
                                  network: values.dspSource,
                                  networkIcon: values.dspSource === '穿山甲SDK' ? '🟢' : '🔵',
                                  platform: values.platform,
                                  dspSource: values.dspSource,
                                  pid: values.pid,
                                  adUnitId: values.pid,
                                  pricingType: values.pricingMode,
                                  price: values.pricingMode === 'bid' ? 0 : Number(values.price) || 0,
                                  enabled: values.status,
                                }
                              : s
                          ),
                        }
                      : g
                  ),
                }
              : scene
          )
        );
        setEditingAdSourceId(null);
        setAddAdSourceModalVisible(false);
        message.success('广告源更新成功');
      } else {
        // 添加模式
        const newSource: AdSource = {
          id: `s-${Date.now()}`,
          name: values.adSourceName,
          network: values.dspSource,
          networkIcon: values.dspSource === '穿山甲SDK' ? '🟢' : '🔵',
          platform: values.platform,
          dspSource: values.dspSource,
          pid: values.pid,
          adUnitId: values.pid,
          isFallback: false,
          pricingType: values.pricingMode,
          price: values.pricingMode === 'bid' ? 0 : Number(values.price) || 0,
          enabled: values.status,
          stats: {
            estimatedRevenue: 0,
            ecpm: 0,
            requestValue: 0,
            requests: 0,
            returns: 0,
            returnRate: '0.00%',
            bidWins: 0,
            winRate: '0.00%',
          },
        };
        setScenes((prev) =>
          prev.map((scene) =>
            scene.id === activeSceneId
              ? {
                  ...scene,
                  groups: scene.groups.map((g) =>
                    g.id === addAdSourceTargetGroupId
                      ? { ...g, adSources: [...g.adSources, newSource] }
                      : g
                  ),
                }
              : scene
          )
        );
        setAddAdSourceModalVisible(false);
        message.success('广告源添加成功');
      }
    } catch {
      // validation failed
    }
  };

  const handleAddAdSourceCancel = () => {
    setAddAdSourceModalVisible(false);
    setEditingAdSourceId(null);
    addAdSourceForm.resetFields();
  };

  const handleBatchAction: MenuProps['onClick'] = ({ key }) => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择广告源');
      return;
    }
    message.success(`批量${key === 'enable' ? '启用' : key === 'disable' ? '禁用' : '删除'}成功`);
    setSelectedRowKeys([]);
  };

  const handleToggleAdSource = (source: AdSource) => {
    const newEnabled = !getAdSourceEnabled(source);
    setAdSourceEnabledMap((prev) => ({ ...prev, [source.id]: newEnabled }));
    message.success(`${newEnabled ? '启用' : '禁用'}广告源: ${source.name}`);
  };

  const handleDeleteAdSource = (source: AdSource) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除广告源 "${source.name}" 吗？`,
      onOk: () => {
        setScenes((prev) =>
          prev.map((scene) =>
            scene.id === activeSceneId
              ? {
                  ...scene,
                  groups: scene.groups.map((g) =>
                    g.id === activeGroupId
                      ? { ...g, adSources: g.adSources.filter((s) => s.id !== source.id) }
                      : g
                  ),
                }
              : scene
          )
        );
        message.success('删除成功');
      },
    });
  };

  const [editingAdSourceId, setEditingAdSourceId] = useState<string | null>(null);

  const handleEditAdSource = (source: AdSource) => {
    setEditingAdSourceId(source.id);
    setAddAdSourceTargetGroupId(activeGroupId);
    addAdSourceForm.setFieldsValue({
      adSourceName: source.name,
      platform: source.platform,
      dspSource: source.dspSource,
      pid: source.pid,
      pricingMode: source.pricingType,
      price: source.pricingType === 'fixed' ? source.price : undefined,
      status: source.enabled,
    });
    setPricingMode(source.pricingType as 'bid' | 'fixed');
    setAddAdSourceModalVisible(true);
  };

  const getAdSourceMenuItems = (source: AdSource): MenuProps['items'] => [
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: '编辑',
      onClick: () => handleEditAdSource(source),
    },
    {
      key: 'copy',
      icon: <CopyOutlined />,
      label: '复制',
      onClick: () => message.success(`已复制广告源: ${source.name}`),
    },
    {
      key: 'moveUp',
      icon: <ArrowUpOutlined />,
      label: '上移',
    },
    {
      key: 'moveDown',
      icon: <ArrowDownOutlined />,
      label: '下移',
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: '删除',
      danger: true,
      onClick: () => handleDeleteAdSource(source),
    },
  ];

  const columns = [
    {
      title: '广告源名称',
      dataIndex: 'name',
      key: 'name',
      width: 135,
      render: (_: any, record: AdSource) => (
        <Tooltip
          title={(
            <div style={{ fontSize: 12, lineHeight: 1.8 }}>
              <div>平台: {record.platform || '-'}</div>
              <div>DSP来源: {record.dspSource || '-'}</div>
              <div>PID: {record.pid || '-'}</div>
              <div>广告源id: {record.id || '-'}</div>
              <div>兜底广告源: {record.isFallback ? '是' : '否'}</div>
            </div>
          )}
          overlayStyle={{ maxWidth: 260 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'default' }}>
            <span style={{ fontSize: 12, width: 16, textAlign: 'center' }}>{record.networkIcon}</span>
            <span style={{ fontSize: 12 }}>{record.name}</span>
            {record.isFallback && (
              <Tag color="green" style={{ marginLeft: 2, fontSize: 10, lineHeight: '14px', padding: '0 4px' }}>兜底</Tag>
            )}
          </div>
        </Tooltip>
      ),
    },
    {
      title: '状态',
      key: 'status',
      width: 60,
      render: (_: any, record: AdSource) => (
        <Switch
          size="small"
          checked={getAdSourceEnabled(record)}
          onChange={() => handleToggleAdSource(record)}
        />
      ),
    },
    {
      title: '',
      key: 'action',
      width: 28,
      render: (_: any, record: AdSource) => (
        <Dropdown menu={{ items: getAdSourceMenuItems(record) }} placement="bottomLeft">
          <Button type="text" icon={<MoreOutlined style={{ fontSize: 14 }} />} size="small" style={{ padding: 0, width: 24 }} />
        </Dropdown>
      ),
    },
    {
      title: (
        <span>
          定价方式
          <Tooltip title="竞价：实时竞价，无需设价；定价：固定CPM价格">
            <QuestionCircleOutlined style={{ marginLeft: 2, color: '#999', fontSize: 12 }} />
          </Tooltip>
        </span>
      ),
      key: 'pricingType',
      width: 58,
      render: (_: any, record: AdSource) => (
        <Tag color={record.pricingType === 'bid' ? 'blue' : 'green'}>
          {record.pricingType === 'bid' ? '竞价' : '定价'}
        </Tag>
      ),
    },
    {
      title: '价格',
      key: 'price',
      width: 62,
      render: (_: any, record: AdSource) => {
        if (record.pricingType === 'bid') {
          return <span style={{ fontSize: 13, color: '#999' }}>-</span>;
        }
        if (editingPriceId === record.id) {
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <InputNumber
                size="small"
                value={editingPriceValue}
                onChange={(val) => setEditingPriceValue(Number(val) || 0)}
                min={0}
                step={0.01}
                precision={2}
                style={{ width: 70 }}
                autoFocus
                onPressEnter={() => {
                  setScenes((prev) =>
                    prev.map((scene) =>
                      scene.id === activeSceneId
                        ? {
                            ...scene,
                            groups: scene.groups.map((g) =>
                              g.id === activeGroupId
                                ? {
                                    ...g,
                                    adSources: g.adSources.map((s) =>
                                      s.id === record.id ? { ...s, price: editingPriceValue } : s
                                    ),
                                  }
                                : g
                            ),
                          }
                        : scene
                    )
                  );
                  setEditingPriceId(null);
                }}
              />
              <Button
                type="text"
                size="small"
                style={{ padding: 0, color: '#52c41a' }}
                onClick={() => {
                  setScenes((prev) =>
                    prev.map((scene) =>
                      scene.id === activeSceneId
                        ? {
                            ...scene,
                            groups: scene.groups.map((g) =>
                              g.id === activeGroupId
                                ? {
                                    ...g,
                                    adSources: g.adSources.map((s) =>
                                      s.id === record.id ? { ...s, price: editingPriceValue } : s
                                    ),
                                  }
                                : g
                            ),
                          }
                        : scene
                    )
                  );
                  setEditingPriceId(null);
                }}
              >
                ✓
              </Button>
              <Button
                type="text"
                size="small"
                style={{ padding: 0, color: '#ff4d4f' }}
                onClick={() => setEditingPriceId(null)}
              >
                ✕
              </Button>
            </div>
          );
        }
        return (
          <span
            style={{ fontSize: 13, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}
            onClick={() => {
              setEditingPriceId(record.id);
              setEditingPriceValue(record.price);
            }}
          >
            {record.price}
            <EditOutlined style={{ fontSize: 12, color: '#1890ff' }} />
          </span>
        );
      },
    },
    {
      title: '预估收入',
      dataIndex: ['stats', 'estimatedRevenue'],
      key: 'estimatedRevenue',
      width: 62,
      align: 'right' as const,
      render: (v: number) => <span style={{ fontSize: 13 }}>{v > 0 ? v.toFixed(2) : '-'}</span>,
    },
    {
      title: (
        <span>
          eCPM
          <Tooltip title="每千次展示的有效收益">
            <QuestionCircleOutlined style={{ marginLeft: 2, color: '#999', fontSize: 12 }} />
          </Tooltip>
        </span>
      ),
      dataIndex: ['stats', 'ecpm'],
      key: 'ecpm',
      width: 52,
      align: 'right' as const,
      render: (v: number) => <span style={{ fontSize: 13 }}>{v > 0 ? v.toFixed(2) : '-'}</span>,
    },
    {
      title: (
        <span>
          千次请求价值
          <Tooltip title="每千次请求的平均价值">
            <QuestionCircleOutlined style={{ marginLeft: 2, color: '#999', fontSize: 12 }} />
          </Tooltip>
        </span>
      ),
      dataIndex: ['stats', 'requestValue'],
      key: 'requestValue',
      width: 72,
      align: 'right' as const,
      render: (v: number) => <span style={{ fontSize: 13 }}>{v > 0 ? v.toFixed(2) : '-'}</span>,
    },
    {
      title: '请求量',
      dataIndex: ['stats', 'requests'],
      key: 'requests',
      width: 52,
      align: 'right' as const,
      render: (v: number) => <span style={{ fontSize: 13 }}>{v > 0 ? v.toLocaleString() : '-'}</span>,
    },
    {
      title: '返回量',
      dataIndex: ['stats', 'returns'],
      key: 'returns',
      width: 52,
      align: 'right' as const,
      render: (v: number) => <span style={{ fontSize: 13 }}>{v > 0 ? v.toLocaleString() : '-'}</span>,
    },
    {
      title: (
        <span>
          返回率
          <Tooltip title="返回量 / 请求量">
            <QuestionCircleOutlined style={{ marginLeft: 2, color: '#999', fontSize: 12 }} />
          </Tooltip>
        </span>
      ),
      dataIndex: ['stats', 'returnRate'],
      key: 'returnRate',
      width: 52,
      align: 'right' as const,
      render: (v: string) => <span style={{ fontSize: 13 }}>{v || '-'}</span>,
    },
    {
      title: (
        <span>
          竞价成功数
          <Tooltip title="竞价成功并展示的次数">
            <QuestionCircleOutlined style={{ marginLeft: 2, color: '#999', fontSize: 12 }} />
          </Tooltip>
        </span>
      ),
      dataIndex: ['stats', 'bidWins'],
      key: 'bidWins',
      width: 65,
      align: 'right' as const,
      render: (v: number) => <span style={{ fontSize: 13 }}>{v > 0 ? v.toLocaleString() : '-'}</span>,
    },
    {
      title: (
        <span>
          竞胜率
          <Tooltip title="竞价成功数 / 返回量">
            <QuestionCircleOutlined style={{ marginLeft: 2, color: '#999', fontSize: 12 }} />
          </Tooltip>
        </span>
      ),
      dataIndex: ['stats', 'winRate'],
      key: 'winRate',
      width: 52,
      align: 'right' as const,
      render: (v: string) => <span style={{ fontSize: 13 }}>{v || '-'}</span>,
    },
  ];

  const disabledColumns = columns.filter((c) => c.key !== 'status');

  const batchMenuItems: MenuProps['items'] = [
    { key: 'enable', label: '批量启用' },
    { key: 'disable', label: '批量禁用' },
    { key: 'delete', label: '批量删除', danger: true },
  ];

  const sortedGroups = useMemo(() => {
    const nonDefault = activeScene.groups.filter((g) => !g.isDefault);
    const defaultGroup = activeScene.groups.find((g) => g.isDefault);
    nonDefault.sort((a, b) => (a.priority || 0) - (b.priority || 0));
    return defaultGroup ? [...nonDefault, defaultGroup] : nonDefault;
  }, [activeScene]);

  const tabItems: TabsProps['items'] = sortedGroups.map((group) => ({
    key: group.id,
    label: (
      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {group.isDefault ? '默认分组' : `${group.priority || 1} - ${group.name}`}
        <Dropdown
          menu={{
            items: [
              {
                key: 'edit',
                icon: <EditOutlined />,
                label: '编辑',
                onClick: (e) => {
                  e.domEvent.stopPropagation();
                  setEditingGroupId(group.id);
                  editGroupForm.setFieldsValue({
                    groupName: group.name,
                    adScene: activeScene?.name || '',
                    adPosition: '1000-' + (activeScene?.name || ''),
                    rules: group.rules?.map((r) => ({
                      dimension: r.dimension,
                      operator: r.operator,
                      values: r.values,
                    })) || [],
                  });
                  setEditGroupModalVisible(true);
                },
              },
              ...(group.isDefault
                ? []
                : [
                    {
                      key: 'delete',
                      icon: <DeleteOutlined />,
                      label: '删除',
                      danger: true as const,
                      onClick: (e: any) => {
                        e.domEvent.stopPropagation();
                        Modal.confirm({
                          title: '确认删除',
                          content: `确定要删除分组 "${group.name}" 吗？`,
                          onOk: () => {
                            setScenes((prev) =>
                              prev.map((scene) =>
                                scene.id === activeSceneId
                                  ? {
                                      ...scene,
                                      groups: scene.groups.filter((g) => g.id !== group.id),
                                    }
                                  : scene
                              )
                            );
                            if (activeGroupId === group.id) {
                              const remaining = sortedGroups.filter((g) => g.id !== group.id);
                              setActiveGroupId(remaining[0]?.id || '');
                            }
                            message.success('分组删除成功');
                          },
                        });
                      },
                    },
                  ]),
            ],
          }}
          trigger={['click']}
        >
          <MoreOutlined
            onClick={(e) => e.stopPropagation()}
            style={{ fontSize: 12, color: '#999', cursor: 'pointer', marginLeft: 2 }}
          />
        </Dropdown>
      </span>
    ),
  }));

  return (
    <div>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item><HomeOutlined /></Breadcrumb.Item>
        <Breadcrumb.Item>流量管理</Breadcrumb.Item>
        <Breadcrumb.Item>流量分组管理</Breadcrumb.Item>
      </Breadcrumb>

      {/* 广告场景选择 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <AdSceneSelector
          scenes={scenes}
          activeSceneId={activeSceneId}
          onChange={handleSceneChange}
        />
        <DatePicker.RangePicker
          value={dateRange}
          onChange={(dates) => {
            if (dates && dates[0] && dates[1]) {
              setDateRange([dates[0], dates[1]]);
            }
          }}
          format="YYYY-MM-DD"
        />
      </div>

      {/* 分组管理区域 */}
      <Card style={{ marginBottom: 16 }} bodyStyle={{ padding: '16px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddGroup}>
              添加分组
            </Button>
            <div style={{ flex: 1 }}>
              {tabItems && tabItems.length > 0 ? (
                <Tabs
                  activeKey={activeGroupId}
                  onChange={setActiveGroupId}
                  items={tabItems}
                  style={{ marginBottom: 0 }}
                  tabBarStyle={{ marginBottom: 0 }}
                />
              ) : (
                <div style={{ color: '#999', padding: '8px 0' }}>暂无分组</div>
              )}
            </div>
          </div>
          <Button icon={<AppstoreAddOutlined />} onClick={handleBatchManageGroups}>
            批量管理分组
          </Button>
        </div>

        {/* 分组规则 */}
        <GroupRules rules={activeGroup?.rules || []} />

        {/* 分组开关 & 流量底价 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 48, marginTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#595959' }}>分组开关</span>
            <Switch
              checked={activeGroup ? getGroupEnabled(activeGroup) : false}
              onChange={(checked) => {
                if (activeGroup) {
                  setGroupEnabledMap((prev) => ({ ...prev, [activeGroup.id]: checked }));
                  message.success(`分组${checked ? '启用' : '禁用'}成功`);
                }
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#595959' }}>分组流量底价:</span>
            <Switch
              size="small"
              checked={activeGroup ? getFloorPriceEnabled(activeGroup) : false}
              onChange={(checked) => {
                if (activeGroup) {
                  setFloorPriceEnabledMap((prev) => ({ ...prev, [activeGroup.id]: checked }));
                }
              }}
            />
            <InputNumber
              disabled={!activeGroup || !getFloorPriceEnabled(activeGroup)}
              value={activeGroup ? getFloorPrice(activeGroup) : 0}
              onChange={(val) => {
                if (activeGroup) {
                  setFloorPriceMap((prev) => ({ ...prev, [activeGroup.id]: val }));
                }
              }}
              min={0}
              precision={2}
              style={{ width: 100 }}
              placeholder="0"
            />
            <span style={{ color: '#999', fontSize: 12 }}>低于此底价的广告将不参与返回</span>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            {activeGroup?.abTest ? (
              <>
                <Select
                  value={abTestForm.getFieldValue('testGroupType') || 'A'}
                  onChange={(val) => abTestForm.setFieldValue('testGroupType', val)}
                  options={[
                    { value: 'A', label: 'A 对照组' },
                    { value: 'B', label: 'B 测试组' },
                  ]}
                  style={{ width: 120 }}
                />
                <span style={{ fontSize: 13, color: '#595959', display: 'flex', alignItems: 'center', gap: 4 }}>
                  流量占比：
                  <InputNumber
                    min={0}
                    max={100}
                    size="small"
                    style={{ width: 60 }}
                    value={abTestForm.getFieldValue('testGroupType') === 'B' ? (abTestForm.getFieldValue('testRatio') || 50) : (abTestForm.getFieldValue('controlRatio') || 50)}
                    onChange={(value) => {
                      const val = Number(value) || 0;
                      if (abTestForm.getFieldValue('testGroupType') === 'B') {
                        abTestForm.setFieldValue('testRatio', val);
                        abTestForm.setFieldValue('controlRatio', 100 - val);
                      } else {
                        abTestForm.setFieldValue('controlRatio', val);
                        abTestForm.setFieldValue('testRatio', 100 - val);
                      }
                      forceUpdate();
                    }}
                  />
                  %
                </span>
                <Button
                  type="link"
                  icon={<LineChartOutlined />}
                  onClick={() => setAbTestDataModalVisible(true)}
                >
                  查看 A/B 测试数据
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="link"
                  icon={<LineChartOutlined />}
                  onClick={() => setTrafficDataModalVisible(true)}
                >
                  查看流量分组数据
                </Button>
                <Button
                  type="primary"
                  icon={<ExperimentOutlined />}
                  disabled={!activeGroup}
                  onClick={() => activeGroup && handleCreateABTest(activeGroup.name)}
                >
                  创建 A/B 测试
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* 广告源操作栏 */}
      <Card bodyStyle={{ padding: '16px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddAdSource}>
              添加广告源
            </Button>
            <Dropdown menu={{ items: batchMenuItems, onClick: handleBatchAction }}>
              <Button>
                批量操作 <span style={{ fontSize: 10 }}>▼</span>
              </Button>
            </Dropdown>
          </Space>
        </div>

        {/* 已启用广告源 */}
        {enabledSources.length > 0 && (
          <Table
            rowSelection={{
              type: 'checkbox',
              selectedRowKeys,
              onChange: setSelectedRowKeys,
              columnWidth: 36,
            }}
            columns={columns}
            dataSource={enabledSources}
            rowKey="id"
            pagination={false}
            size="small"
            tableLayout="fixed"
            bordered={false}
          />
        )}

        {/* 未启用广告源 */}
        {disabledSources.length > 0 && (
          <Collapse
            ghost
            style={{ marginTop: enabledSources.length > 0 ? 16 : 0 }}
            defaultActiveKey={[]}
            items={[
              {
                key: 'disabled',
                label: (
                  <span style={{ color: '#595959', fontSize: 14 }}>
                    <span style={{ marginRight: 4 }}>▼</span>
                    {disabledSources.length}个广告源未启用
                  </span>
                ),
                children: (
                  <Table
                    rowSelection={{
                      type: 'checkbox',
                      selectedRowKeys,
                      onChange: setSelectedRowKeys,
                      columnWidth: 36,
                    }}
                    columns={disabledColumns}
                    dataSource={disabledSources}
                    rowKey="id"
                    pagination={false}
                    size="small"
                    tableLayout="fixed"
                    showHeader={enabledSources.length === 0}
                    bordered={false}
                  />
                ),
              },
            ]}
          />
        )}
      </Card>

      {/* 添加分组弹窗 */}
      <Modal
        title="添加分组"
        open={addGroupModalVisible}
        onOk={handleAddGroupSubmit}
        onCancel={handleAddGroupCancel}
        okText="提交"
        cancelText="取消"
        width={560}
      >
        <Form
          form={addGroupForm}
          layout="horizontal"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
          style={{ marginTop: 24 }}
        >
          <Form.Item
            label="分组名称"
            name="groupName"
            rules={[{ required: true, message: '请输入分组名称' }]}
          >
            <Input
              placeholder="请输入分组名称"
              maxLength={20}
              showCount
            />
          </Form.Item>

          <Form.Item label="广告场景">
            <span style={{ color: '#595959' }}>{activeScene?.name}</span>
          </Form.Item>

          <Form.Item label="广告位" name="adPosition" initialValue="1000-开屏">
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

          <Form.Item label="分组规则" required style={{ marginBottom: 0 }}>
            <Form.List
              name="rules"
              rules={[
                {
                  validator: async (_, rules) => {
                    if (!rules || rules.length === 0) {
                      return Promise.reject(new Error('请至少添加一条分组规则'));
                    }
                    for (let i = 0; i < rules.length; i++) {
                      const r = rules[i];
                      if (!r.dimension) {
                        return Promise.reject(new Error(`规则${i + 1}：请选择维度`));
                      }
                      if (!r.values || r.values.length === 0) {
                        return Promise.reject(new Error(`规则${i + 1}：请选择值`));
                      }
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Form.Item
                    key={field.key}
                    label={index === 0 ? '规则' : ''}
                    style={{ marginBottom: 12 }}
                  >
                    <Row gutter={8} align="middle">
                      <Col span={7}>
                        <Form.Item
                          name={[field.name, 'dimension']}
                          noStyle
                          rules={[{ required: true, message: '请选择维度' }]}
                        >
                          <Select
                            placeholder="选择维度"
                            options={dimensionOptions}
                            onChange={() => {
                              addGroupForm.setFieldValue(['rules', field.name, 'values'], []);
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={5}>
                        <Form.Item
                          name={[field.name, 'operator']}
                          initialValue="包含"
                          noStyle
                        >
                          <Select
                            options={[
                              { label: '包含', value: '包含' },
                              { label: '不包含', value: '不包含' },
                            ]}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={10}>
                        <Form.Item
                          noStyle
                          shouldUpdate={(prev, curr) => {
                            const prevDim = prev.rules?.[field.name]?.dimension;
                            const currDim = curr.rules?.[field.name]?.dimension;
                            return prevDim !== currDim;
                          }}
                        >
                          {({ getFieldValue }) => {
                            const dimension = getFieldValue(['rules', field.name, 'dimension']);
                            const valueOptions = getDimensionValueOptions(dimension).map((v) => ({
                              label: v,
                              value: v,
                            }));
                            return (
                              <Form.Item
                                name={[field.name, 'values']}
                                noStyle
                                rules={[{ required: true, message: '请选择值' }]}
                              >
                                <Select
                                  mode="multiple"
                                  placeholder="请选择"
                                  options={valueOptions}
                                  style={{ width: '100%' }}
                                />
                              </Form.Item>
                            );
                          }}
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => remove(field.name)}
                          size="small"
                        />
                      </Col>
                    </Row>
                  </Form.Item>
                ))}
                <Form.Item wrapperCol={{ offset: 5, span: 19 }}>
                  <Button
                    type="dashed"
                    onClick={() => add({ operator: '包含' })}
                    block
                    icon={<PlusOutlined />}
                  >
                    添加规则
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑分组弹窗 */}
      <Modal
        title="编辑分组"
        open={editGroupModalVisible}
        onOk={handleEditGroupSubmit}
        onCancel={handleEditGroupCancel}
        okText="提交"
        cancelText="取消"
        width={560}
      >
        <Form
          form={editGroupForm}
          layout="horizontal"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
          style={{ marginTop: 24 }}
        >
          <Form.Item
            label="分组名称"
            name="groupName"
            rules={[{ required: true, message: '请输入分组名称' }]}
          >
            <Input placeholder="请输入分组名称" maxLength={20} showCount />
          </Form.Item>

          <Form.Item label="广告场景" name="adScene">
            <Input disabled />
          </Form.Item>

          <Form.Item label="广告位" name="adPosition">
            <Input disabled />
          </Form.Item>

          <Form.Item label="分组规则" required style={{ marginBottom: 0 }}>
            <Form.List
              name="rules"
              rules={[
                {
                  validator: async (_, rules) => {
                    if (!rules || rules.length === 0) {
                      return Promise.reject(new Error('请至少添加一条分组规则'));
                    }
                    for (let i = 0; i < rules.length; i++) {
                      const r = rules[i];
                      if (!r.dimension) {
                        return Promise.reject(new Error(`规则${i + 1}：请选择维度`));
                      }
                      if (!r.values || r.values.length === 0) {
                        return Promise.reject(new Error(`规则${i + 1}：请选择值`));
                      }
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Form.Item
                    key={field.key}
                    label={index === 0 ? '规则' : ''}
                    style={{ marginBottom: 12 }}
                  >
                    <Row gutter={8} align="middle">
                      <Col span={7}>
                        <Form.Item
                          name={[field.name, 'dimension']}
                          noStyle
                          rules={[{ required: true, message: '请选择维度' }]}
                        >
                          <Select
                            placeholder="选择维度"
                            options={dimensionOptions}
                            onChange={() => {
                              editGroupForm.setFieldValue(['rules', field.name, 'values'], []);
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={5}>
                        <Form.Item
                          name={[field.name, 'operator']}
                          initialValue="包含"
                          noStyle
                        >
                          <Select
                            options={[
                              { label: '包含', value: '包含' },
                              { label: '不包含', value: '不包含' },
                            ]}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={10}>
                        <Form.Item
                          noStyle
                          shouldUpdate={(prev, curr) => {
                            const prevDim = prev.rules?.[field.name]?.dimension;
                            const currDim = curr.rules?.[field.name]?.dimension;
                            return prevDim !== currDim;
                          }}
                        >
                          {({ getFieldValue }) => {
                            const dimension = getFieldValue(['rules', field.name, 'dimension']);
                            const valueOptions = getDimensionValueOptions(dimension).map((v) => ({
                              label: v,
                              value: v,
                            }));
                            return (
                              <Form.Item
                                name={[field.name, 'values']}
                                noStyle
                                rules={[{ required: true, message: '请选择值' }]}
                              >
                                <Select
                                  mode="multiple"
                                  placeholder="请选择"
                                  options={valueOptions}
                                  style={{ width: '100%' }}
                                />
                              </Form.Item>
                            );
                          }}
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => remove(field.name)}
                          size="small"
                        />
                      </Col>
                    </Row>
                  </Form.Item>
                ))}
                <Form.Item wrapperCol={{ offset: 5, span: 19 }}>
                  <Button
                    type="dashed"
                    onClick={() => add({ operator: '包含' })}
                    block
                    icon={<PlusOutlined />}
                  >
                    添加规则
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          </Form.Item>
        </Form>
      </Modal>

      {/* 添加广告源弹窗 */}
      <Modal
        title={editingAdSourceId ? '编辑广告源' : '添加广告源'}
        open={addAdSourceModalVisible}
        onOk={handleAddAdSourceSubmit}
        onCancel={handleAddAdSourceCancel}
        okText="提交"
        cancelText="取消"
        width={560}
      >
        <Form
          form={addAdSourceForm}
          layout="horizontal"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
          style={{ marginTop: 24 }}
        >
          <Form.Item
            label="广告源名称"
            name="adSourceName"
            rules={[{ required: true, message: '请选择广告源名称' }]}
          >
            <Select
              placeholder="请选择广告源名称"
              options={[
                { label: 'MY--嗨量 (hailiang)', value: 'MY--嗨量 (hailiang)' },
                { label: 'MY-TapTap(iOS-图片) (taptap1)', value: 'MY-TapTap(iOS-图片) (taptap1)' },
                { label: 'MY-TapTap-安卓 (taptap)', value: 'MY-TapTap-安卓 (taptap)' },
                { label: 'MY-佳投 (jiatou)', value: 'MY-佳投 (jiatou)' },
                { label: 'MY-倍业(美团) (beiye2)', value: 'MY-倍业(美团) (beiye2)' },
                { label: 'MY-南京风船 (yundong)', value: 'MY-南京风船 (yundong)' },
              ]}
            />
          </Form.Item>

          <Form.Item label="平台范围" name="platform" initialValue="安卓">
            <Radio.Group
              options={[
                { label: '安卓', value: '安卓' },
                { label: 'iOS', value: 'iOS' },
              ]}
            />
          </Form.Item>

          <Form.Item label="广告场景">
            <span style={{ color: '#595959' }}>{activeScene?.name}</span>
          </Form.Item>

          <Form.Item
            label="DSP来源"
            name="dspSource"
            rules={[{ required: true, message: '请选择DSP来源' }]}
            initialValue="优量汇SDK"
          >
            <Select
              placeholder="请选择DSP来源"
              options={[
                { label: '穿山甲SDK', value: '穿山甲SDK' },
                { label: '优量汇SDK', value: '优量汇SDK' },
                { label: '快手SDK', value: '快手SDK' },
                { label: '百度SDK', value: '百度SDK' },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="广告代码位ID"
            name="pid"
            rules={[{ required: true, message: '请选择广告代码位ID' }]}
          >
            <Select
              placeholder="请选择代码位ID"
              showSearch
              optionFilterProp="label"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={[
                { label: '10001 - 开屏 (安卓)', value: '10001' },
                { label: '10002 - 激励视频 (iOS)', value: '10002' },
                { label: '10003 - 插屏 (安卓)', value: '10003' },
                { label: '10004 - 信息流 (iOS)', value: '10004' },
                { label: '10005 - 开屏 (安卓)', value: '10005' },
                { label: '10006 - Banner (安卓)', value: '10006' },
                { label: '10007 - 原生插屏 (iOS)', value: '10007' },
                { label: '10008 - 全屏视频 (安卓)', value: '10008' },
                { label: '10009 - 开屏 (iOS)', value: '10009' },
                { label: '10010 - 信息流 (安卓)', value: '10010' },
              ]}
            />
          </Form.Item>

          <Form.Item label="价格模式" name="pricingMode" initialValue="bid">
            <Segmented
              options={[
                { label: '竞价', value: 'bid' },
                { label: '定价', value: 'fixed' },
              ]}
              onChange={(value) => setPricingMode(value as 'bid' | 'fixed')}
            />
          </Form.Item>

          {pricingMode === 'fixed' && (
            <Form.Item
              label="价格(元)"
              name="price"
              rules={[{ required: true, message: '请输入价格' }]}
            >
              <InputNumber
                placeholder="请输入价格"
                min={0}
                precision={2}
                style={{ width: '100%' }}
              />
            </Form.Item>
          )}

          <Form.Item label="状态" name="status" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      {/* 批量设置流量底价弹窗 */}
      <Modal
        title="批量设置流量底价"
        open={batchFloorPriceVisible}
        onOk={handleBatchFloorPriceSubmit}
        onCancel={handleBatchFloorPriceCancel}
        okText="提交"
        cancelText="取消"
        width={560}
      >
        <Form
          form={batchFloorPriceForm}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          style={{ marginTop: 24 }}
        >
          <Form.Item
            label="统一设置底价"
            name="floorPriceEnabled"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prev, curr) => prev.floorPriceEnabled !== curr.floorPriceEnabled}
          >
            {({ getFieldValue }) => {
              const useUniform = getFieldValue('floorPriceEnabled');
              if (!useUniform) return null;
              return (
                <Form.Item
                  label="流量底价"
                  name="floorPrice"
                  rules={[{ required: true, message: '请输入流量底价' }]}
                >
                  <InputNumber
                    placeholder="请输入流量底价"
                    min={0}
                    step={0.01}
                    precision={2}
                    style={{ width: '100%' }}
                    addonAfter="元"
                  />
                </Form.Item>
              );
            }}
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prev, curr) => prev.floorPriceEnabled !== curr.floorPriceEnabled}
          >
            {({ getFieldValue }) => {
              const useUniform = getFieldValue('floorPriceEnabled');
              if (useUniform) return null;
              return (
                <Form.List name="groupFloorPrices">
                  {(fields) => (
                    <>
                      {fields.map((field) => (
                        <Row key={field.key} gutter={16} style={{ marginBottom: 12 }}>
                          <Col span={10}>
                            <Form.Item name={[field.name, 'groupName']} noStyle>
                              <Input disabled />
                            </Form.Item>
                          </Col>
                          <Col span={6}>
                            <Form.Item
                              name={[field.name, 'enabled']}
                              valuePropName="checked"
                              noStyle
                            >
                              <Switch checkedChildren="启用" unCheckedChildren="禁用" />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item
                              name={[field.name, 'price']}
                              noStyle
                              rules={[{ required: true, message: '请输入底价' }]}
                            >
                              <InputNumber
                                placeholder="底价"
                                min={0}
                                step={0.01}
                                precision={2}
                                style={{ width: '100%' }}
                                addonAfter="元"
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      ))}
                    </>
                  )}
                </Form.List>
              );
            }}
          </Form.Item>
        </Form>
      </Modal>

      {/* 批量管理分组弹窗 */}
      <Modal
        title="批量管理分组"
        open={batchManageVisible}
        onCancel={handleBatchManageClose}
        footer={null}
        width={640}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, marginTop: 16 }}>
          <Select
            value={batchManageFilter}
            onChange={setBatchManageFilter}
            style={{ width: 160 }}
            options={[
              { label: '已开启的分组', value: 'enabled' },
              { label: '已关闭的分组', value: 'disabled' },
            ]}
          />
          <Dropdown
            menu={{
              items: [
                {
                  key: 'floorPrice',
                  label: '批量设置流量底价',
                  onClick: handleBatchFloorPrice,
                },
                {
                  key: 'close',
                  label: '关闭分组',
                  danger: true,
                  onClick: handleBatchCloseGroups,
                },
              ],
            }}
          >
            <Button type="primary">
              批量操作 <span style={{ fontSize: 10 }}>▼</span>
            </Button>
          </Dropdown>
        </div>

        <Table
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: batchManageSelectedKeys,
            onChange: setBatchManageSelectedKeys,
            getCheckboxProps: (record: WaterfallGroup) => ({
              disabled: record.isDefault,
            }),
            columnWidth: 40,
          }}
          dataSource={sortedGroups.filter((g) =>
            batchManageFilter === 'enabled' ? getGroupEnabled(g) : !getGroupEnabled(g)
          )}
          rowKey="id"
          pagination={false}
          size="middle"
          columns={[
            {
              title: '',
              key: 'move',
              width: 60,
              render: (_: any, record: WaterfallGroup) =>
                record.isDefault ? null : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <Button
                      type="text"
                      size="small"
                      style={{ padding: 0, lineHeight: 1 }}
                      onClick={() => handleMoveGroupPriority(record.id, 'up')}
                    >
                      ▲
                    </Button>
                    <Button
                      type="text"
                      size="small"
                      style={{ padding: 0, lineHeight: 1 }}
                      onClick={() => handleMoveGroupPriority(record.id, 'down')}
                    >
                      ▼
                    </Button>
                  </div>
                ),
            },
            {
              title: '优先级',
              dataIndex: 'priority',
              key: 'priority',
              width: 80,
              align: 'center' as const,
              render: (_: any, record: WaterfallGroup) => (
                <span>{record.isDefault ? '-' : (record.priority || 1)}</span>
              ),
            },
            {
              title: '分组名称',
              dataIndex: 'name',
              key: 'name',
              render: (_: any, record: WaterfallGroup) => (
                <span>
                  {record.isDefault ? (
                    <span>
                      <span style={{ marginRight: 4 }}>🔒</span>
                      默认分组
                    </span>
                  ) : (
                    `${record.priority || 1} - ${record.name}`
                  )}
                </span>
              ),
            },
            {
              title: '状态',
              key: 'status',
              width: 80,
              align: 'center' as const,
              render: (_: any, record: WaterfallGroup) => (
                <Switch
                  size="small"
                  checked={getGroupEnabled(record)}
                  onChange={(checked) => handleToggleGroupEnabledInBatch(record, checked)}
                  disabled={record.isDefault}
                />
              ),
            },
          ]}
        />
      </Modal>

      {/* 创建A/B测试弹窗 */}
      <Modal
        title={abTestStep === 1 ? '创建 A/B 测试' : '配置测试组瀑布流'}
        open={abTestModalVisible}
        onOk={handleABTestSubmit}
        onCancel={handleABTestCancel}
        okText={abTestStep === 1 ? '下一步' : '开启测试'}
        cancelText={abTestStep === 1 ? '取消' : '取消测试'}
        width={abTestStep === 1 ? 560 : 900}
      >
        {abTestStep === 1 ? (
          <Form
            form={abTestForm}
            layout="horizontal"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 19 }}
            style={{ marginTop: 24 }}
          >
            <Form.Item label="分组名称">
              <span style={{ fontWeight: 'bold', color: '#1890ff' }}>{abTestTargetGroup}</span>
            </Form.Item>

            <Form.Item
              label="测试名称"
              name="testName"
              rules={[{ required: true, message: '请输入测试名称' }]}
            >
              <Input placeholder="请输入测试名称" maxLength={100} showCount />
            </Form.Item>

            <Form.Item label="流量比例" required>
              <div style={{ padding: '8px 0' }}>
                <Form.Item name="controlRatio" noStyle>
                  <input type="hidden" />
                </Form.Item>
                <Form.Item name="testRatio" noStyle>
                  <input type="hidden" />
                </Form.Item>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                    <span style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: '#52c41a',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 'bold',
                    }}>A</span>
                    <span style={{ fontSize: 13 }}>对照组</span>
                    <Form.Item name="controlRatio" noStyle rules={[{ required: true }]}>
                      <InputNumber
                        min={0}
                        max={100}
                        style={{ width: 70 }}
                        formatter={(value) => `${value}`}
                        onChange={(value) => {
                          const control = Number(value) || 0;
                          abTestForm.setFieldValue('testRatio', 100 - control);
                        }}
                      />
                    </Form.Item>
                    <span>%</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                    <span style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: '#fa8c16',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 'bold',
                    }}>B</span>
                    <span style={{ fontSize: 13 }}>测试组</span>
                    <Form.Item name="testRatio" noStyle rules={[{ required: true }]}>
                      <InputNumber
                        min={0}
                        max={100}
                        style={{ width: 70 }}
                        formatter={(value) => `${value}`}
                        onChange={(value) => {
                          const test = Number(value) || 0;
                          abTestForm.setFieldValue('controlRatio', 100 - test);
                        }}
                      />
                    </Form.Item>
                    <span>%</span>
                  </div>
                </div>
              </div>
            </Form.Item>

            <Form.Item
              name="copyConfig"
              valuePropName="checked"
              wrapperCol={{ offset: 5, span: 19 }}
            >
              <span style={{ fontSize: 13 }}>
                <input type="checkbox" checked style={{ marginRight: 4 }} />
                将 A 组瀑布流配置复制给 B 组
              </span>
            </Form.Item>
          </Form>
        ) : (
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <Select
                value={abTestForm.getFieldValue('testGroupType') || 'B'}
                onChange={(val) => abTestForm.setFieldValue('testGroupType', val)}
                options={[
                  { value: 'A', label: 'A 对照组' },
                  { value: 'B', label: 'B 测试组' },
                ]}
                style={{ width: 120 }}
              />
              <span>流量比例：{abTestForm.getFieldValue('testRatio') || 50}%</span>
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <Button type="primary" onClick={handleAddAdSource}>添加广告源</Button>
            </div>

            {/* 已启用广告源 */}
            <div style={{ marginBottom: 8, fontWeight: 'bold' }}>已启用的广告源</div>
            <Table
              size="small"
              bordered
              pagination={false}
              dataSource={[
                { key: '1', priority: '1', name: '测试-自渲染2', type: '原生', status: true, floorPrice: '跟随分组', sortPrice: '竞价', autoPrice: '-' },
                { key: '2', priority: '2', name: '优量汇-自渲染-bidding', type: '原生', status: true, floorPrice: '跟随分组', sortPrice: '竞价', autoPrice: '-' },
              ]}
              columns={[
                { title: '优先级', dataIndex: 'priority', key: 'priority', width: 70, align: 'center' as const },
                { title: '广告源', dataIndex: 'name', key: 'name', render: (v: string, r: any) => <span>{v} <Tag>{r.type}</Tag></span> },
                { title: '状态', dataIndex: 'status', key: 'status', width: 80, render: (v: boolean) => <Switch size="small" checked={v} /> },
                { title: '定价方式', dataIndex: 'sortPrice', key: 'sortPrice', width: 100 },
                {
                  title: '价格',
                  dataIndex: 'floorPrice',
                  key: 'floorPrice',
                  width: 130,
                  render: (v: string) => (
                    <Input size="small" defaultValue={v} style={{ width: 100 }} />
                  ),
                },
              ]}
            />
            {/* 未启用广告源 */}
            <div style={{ marginTop: 12, marginBottom: 8, fontWeight: 'bold', color: '#595959' }}>未启用的广告源</div>
            <Table
              size="small"
              bordered
              pagination={false}
              dataSource={[
                { key: '3', priority: '-', name: '优量汇-纯视频-bidding', type: '原生', status: false, floorPrice: '跟随分组', sortPrice: '竞价', autoPrice: '-' },
              ]}
              columns={[
                { title: '优先级', dataIndex: 'priority', key: 'priority', width: 70, align: 'center' as const },
                { title: '广告源', dataIndex: 'name', key: 'name', render: (v: string, r: any) => <span>{v} <Tag>{r.type}</Tag></span> },
                { title: '状态', dataIndex: 'status', key: 'status', width: 80, render: (v: boolean) => <Switch size="small" checked={v} /> },
                { title: '定价方式', dataIndex: 'sortPrice', key: 'sortPrice', width: 100 },
                {
                  title: '价格',
                  dataIndex: 'floorPrice',
                  key: 'floorPrice',
                  width: 130,
                  render: (v: string) => (
                    <Input size="small" defaultValue={v} style={{ width: 100 }} />
                  ),
                },
              ]}
            />
          </div>
        )}
      </Modal>

      {/* 查看流量分组数据弹窗 */}
      <Modal
        title="查看流量分组数据"
        open={trafficDataModalVisible}
        onOk={() => setTrafficDataModalVisible(false)}
        onCancel={() => setTrafficDataModalVisible(false)}
        okText="确定"
        cancelText="取消"
        width={960}
      >
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Space>
              <Segmented
                options={[
                  { label: '数据图表', value: 'chart' },
                  { label: '数据指标', value: 'metric' },
                ]}
                value={dataMetricTab}
                onChange={(v) => setDataMetricTab(v as string)}
              />
              <Select
                value={deuMetric}
                onChange={setDeuMetric}
                style={{ width: 120 }}
                options={[
                  { label: '千人均收益', value: '千人均收益' },
                  { label: '预估收入', value: '预估收入' },
                  { label: 'eCPM', value: 'eCPM' },
                  { label: '千次请求价值', value: '千次请求价值' },
                  { label: '请求量', value: '请求量' },
                  { label: '返回率', value: '返回率' },
                  { label: '竞价成功数', value: '竞价成功数' },
                  { label: '竞价成功率', value: '竞价成功率' },
                  { label: '展示量', value: '展示量' },
                  { label: '竞胜展示率', value: '竞胜展示率' },
                  { label: '点击数', value: '点击数' },
                  { label: '点击率', value: '点击率' },
                  { label: 'cpc', value: 'cpc' },
                ]}
              />
            </Space>
            <Space>
              <DatePicker.RangePicker
                defaultValue={[dayjs(), dayjs()]}
                format="YYYY-MM-DD"
                allowClear={false}
                style={{ width: 240 }}
              />
              <span style={{ color: '#999', fontSize: 12 }}>
                展示筛选周期内预估收益(¥) <Tag color="default">TOP5</Tag> 流量分组
              </span>
            </Space>
          </div>

          {/* 模拟折线图 */}
          <div style={{ height: 280, border: '1px solid #f0f0f0', borderRadius: 4, padding: 16, marginBottom: 16, position: 'relative' }}>
            <div style={{ textAlign: 'center', marginBottom: 8, color: '#595959' }}>{deuMetric}</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', height: 200, gap: 80, position: 'relative' }}>
              {/* Y轴 */}
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 24, width: 40, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: 11, color: '#999' }}>
                <span>18,000</span>
                <span>15,000</span>
                <span>12,000</span>
                <span>9,000</span>
                <span>6,000</span>
                <span>3,000</span>
                <span>0</span>
              </div>
              {/* 网格线 */}
              <div style={{ position: 'absolute', left: 48, right: 16, top: 0, bottom: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                {[0,1,2,3,4,5,6].map(i => <div key={i} style={{ borderTop: '1px dashed #eee', height: 0 }} />)}
              </div>
              {/* 折线图 */}
              <div style={{ position: 'absolute', left: 48, right: 16, top: 0, bottom: 24 }}>
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                  <polyline fill="none" stroke="#1890ff" strokeWidth={0.8} points="0,33 17,17 33,28 50,11 67,22 83,6 100,17" />
                  <polyline fill="none" stroke="#52c41a" strokeWidth={0.8} points="0,56 17,44 33,50 50,39 67,47 83,33 100,42" />
                  <circle cx="0" cy="33" r={1.5} fill="#1890ff" />
                  <circle cx="17" cy="17" r={1.5} fill="#1890ff" />
                  <circle cx="33" cy="28" r={1.5} fill="#1890ff" />
                  <circle cx="50" cy="11" r={1.5} fill="#1890ff" />
                  <circle cx="67" cy="22" r={1.5} fill="#1890ff" />
                  <circle cx="83" cy="6" r={1.5} fill="#1890ff" />
                  <circle cx="100" cy="17" r={1.5} fill="#1890ff" />
                  <circle cx="0" cy="56" r={1.5} fill="#52c41a" />
                  <circle cx="17" cy="44" r={1.5} fill="#52c41a" />
                  <circle cx="33" cy="50" r={1.5} fill="#52c41a" />
                  <circle cx="50" cy="39" r={1.5} fill="#52c41a" />
                  <circle cx="67" cy="47" r={1.5} fill="#52c41a" />
                  <circle cx="83" cy="33" r={1.5} fill="#52c41a" />
                  <circle cx="100" cy="42" r={1.5} fill="#52c41a" />
                </svg>
                <div style={{ position: 'absolute', bottom: -20, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#999' }}>
                  <span>05-01</span>
                  <span>05-02</span>
                  <span>05-03</span>
                  <span>05-04</span>
                  <span>05-05</span>
                  <span>05-06</span>
                  <span>05-07</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 8 }}>
              <span><span style={{ display: 'inline-block', width: 12, height: 3, background: '#1890ff', marginRight: 6, verticalAlign: 'middle' }} />默认分组</span>
              <span><span style={{ display: 'inline-block', width: 12, height: 3, background: '#52c41a', marginRight: 6, verticalAlign: 'middle' }} />实验分组</span>
            </div>
          </div>

          {/* 数据表格 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontWeight: 'bold' }}>数据图表</span>
            <Checkbox>分组数据对比</Checkbox>
          </div>
          <Table
            size="small"
            bordered
            pagination={false}
            scroll={{ x: 'max-content' }}
            dataSource={[
              { key: 'total', group: '汇总', arpu: '0.03', revenue: '614.75', ecpm: '23.00', requestValue: '15.20', requests: '33,120', returnRate: '94.36%', bidWins: '19,109', bidWinRate: '57.70%', impressions: '19,109', winShowRate: '100.00%', clicks: '764', ctr: '4.00%', cpc: '0.80' },
              { key: 'exp', group: '实验分组', groupId: '184407(已删除)', arpu: '-', revenue: '-', ecpm: '-', requestValue: '-', requests: '-', returnRate: '-', bidWins: '-', bidWinRate: '-', impressions: '-', winShowRate: '-', clicks: '-', ctr: '-', cpc: '-' },
              { key: 'default', group: '默认分组', groupId: '168823', arpu: '0.03', revenue: '614.75', ecpm: '23.00', requestValue: '15.20', requests: '33,120', returnRate: '94.36%', bidWins: '19,109', bidWinRate: '57.70%', impressions: '19,109', winShowRate: '100.00%', clicks: '764', ctr: '4.00%', cpc: '0.80' },
            ]}
            columns={[
              { title: '流量分组', dataIndex: 'group', key: 'group', fixed: 'left' as const, width: 120, render: (v: string, r: any) => <div>{v}{r.groupId ? <div style={{ fontSize: 11, color: '#999' }}>{r.groupId}</div> : null}</div> },
              { title: '千人均收益', dataIndex: 'arpu', key: 'arpu', align: 'center' as const, width: 90 },
              { title: '预估收入', dataIndex: 'revenue', key: 'revenue', align: 'center' as const, width: 90 },
              { title: 'eCPM', dataIndex: 'ecpm', key: 'ecpm', align: 'center' as const, width: 70 },
              { title: '千次请求价值', dataIndex: 'requestValue', key: 'requestValue', align: 'center' as const, width: 100 },
              { title: '请求量', dataIndex: 'requests', key: 'requests', align: 'center' as const, width: 80 },
              { title: '返回率', dataIndex: 'returnRate', key: 'returnRate', align: 'center' as const, width: 80 },
              { title: '竞价成功数', dataIndex: 'bidWins', key: 'bidWins', align: 'center' as const, width: 90 },
              { title: '竞价成功率', dataIndex: 'bidWinRate', key: 'bidWinRate', align: 'center' as const, width: 90 },
              { title: '展示量', dataIndex: 'impressions', key: 'impressions', align: 'center' as const, width: 80 },
              { title: '竞胜展示率', dataIndex: 'winShowRate', key: 'winShowRate', align: 'center' as const, width: 90 },
              { title: '点击数', dataIndex: 'clicks', key: 'clicks', align: 'center' as const, width: 80 },
              { title: '点击率', dataIndex: 'ctr', key: 'ctr', align: 'center' as const, width: 80 },
              { title: 'cpc', dataIndex: 'cpc', key: 'cpc', align: 'center' as const, width: 70 },
            ]}
          />
        </div>
      </Modal>

      {/* 查看A/B测试数据弹窗 */}
      <Modal
        title="A/B测试数据"
        open={abTestDataModalVisible}
        onOk={() => setAbTestDataModalVisible(false)}
        onCancel={() => setAbTestDataModalVisible(false)}
        okText="确定"
        cancelText="取消"
        width={980}
      >
        <div style={{ marginTop: 16 }}>
          {/* 顶部信息栏 */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#f6ffed',
              border: '1px solid #b7eb8f',
              borderRadius: 4,
              padding: '12px 16px',
              marginBottom: 16,
            }}
          >
            <div style={{ display: 'flex', gap: 32, fontSize: 13 }}>
              <span>
                <span style={{ color: '#999' }}>测试名称：</span>
                <span style={{ fontWeight: 'bold', color: '#262626' }}>
                  {abTestForm.getFieldValue('testName') || '分组测试1-A/B测试'}
                </span>
              </span>
              <span>
                <span style={{ color: '#999' }}>生效时间：</span>
                <span style={{ color: '#262626' }}>
                  {abTestForm.getFieldValue('effectiveTime')
                    ? abTestForm.getFieldValue('effectiveTime').format('YYYY-MM-DD HH:mm:ss')
                    : dayjs().format('YYYY-MM-DD HH:mm:ss')}
                </span>
              </span>
              <span>
                <span style={{ color: '#999' }}>运行时长：</span>
                <span style={{ color: '#262626' }}>
                  {(() => {
                    const effective = abTestForm.getFieldValue('effectiveTime');
                    const start = effective ? dayjs(effective) : dayjs();
                    const diffHours = dayjs().diff(start, 'hour');
                    if (diffHours < 24) return `${diffHours}小时`;
                    const diffDays = dayjs().diff(start, 'day');
                    return `${diffDays}天`;
                  })()}
                </span>
              </span>
            </div>
            <Space>
              <Button
                size="small"
                style={{
                  background: '#52c41a',
                  color: '#fff',
                  borderColor: '#52c41a',
                }}
              >
                全量A组
              </Button>
              <Button
                size="small"
                style={{
                  background: '#fa8c16',
                  color: '#fff',
                  borderColor: '#fa8c16',
                }}
              >
                全量B组
              </Button>
            </Space>
          </div>

          {/* 数据表格 */}
          <Table
            size="small"
            bordered
            pagination={false}
            dataSource={[
              {
                key: 'A',
                group: 'A(对照组)',
                arpu: '0.05',
                revenue: '1,014.97',
                ecpm: '23.17',
                requestValue: '18.52',
                requests: '54,720',
                returnRate: '96.78%',
                bidWins: '26,462',
                bidWinRate: '48.36%',
                impressions: '26,462',
                winShowRate: '100.00%',
                clicks: '1,058',
                ctr: '4.00%',
                cpc: '0.96',
              },
              {
                key: 'B',
                group: 'B(实验组)',
                arpu: '0.01',
                revenue: '23.67',
                ecpm: '11.35',
                requestValue: '8.21',
                requests: '4,580',
                returnRate: '89.27%',
                bidWins: '1,950',
                bidWinRate: '42.58%',
                impressions: '1,950',
                winShowRate: '100.00%',
                clicks: '68',
                ctr: '3.49%',
                cpc: '0.35',
              },
              {
                key: 'diff',
                group: '对比涨幅',
                arpu: '-80.00%',
                revenue: '-97.67%',
                ecpm: '-51.01%',
                requestValue: '-55.67%',
                requests: '-91.63%',
                returnRate: '-7.76%',
                bidWins: '-92.63%',
                bidWinRate: '-11.95%',
                impressions: '-92.63%',
                winShowRate: '0.00%',
                clicks: '-93.57%',
                ctr: '-12.75%',
                cpc: '-63.54%',
              },
            ]}
            columns={[
              {
                title: '组别',
                dataIndex: 'group',
                key: 'group',
                align: 'center' as const,
                fixed: 'left' as const,
                width: 100,
                render: (v: string, r: any) => (
                  <span
                    style={{
                      fontWeight: r.key === 'diff' ? 'bold' : 'normal',
                      color:
                        r.key === 'diff'
                          ? '#262626'
                          : r.key === 'A'
                            ? '#52c41a'
                            : '#fa8c16',
                    }}
                  >
                    {v}
                  </span>
                ),
              },
              { title: '千人均收益', dataIndex: 'arpu', key: 'arpu', align: 'center' as const, width: 90 },
              { title: '预估收入', dataIndex: 'revenue', key: 'revenue', align: 'center' as const, width: 90 },
              { title: 'eCPM', dataIndex: 'ecpm', key: 'ecpm', align: 'center' as const, width: 70 },
              { title: '千次请求价值', dataIndex: 'requestValue', key: 'requestValue', align: 'center' as const, width: 100 },
              { title: '请求量', dataIndex: 'requests', key: 'requests', align: 'center' as const, width: 80 },
              { title: '返回率', dataIndex: 'returnRate', key: 'returnRate', align: 'center' as const, width: 80 },
              { title: '竞价成功数', dataIndex: 'bidWins', key: 'bidWins', align: 'center' as const, width: 90 },
              { title: '竞价成功率', dataIndex: 'bidWinRate', key: 'bidWinRate', align: 'center' as const, width: 90 },
              { title: '展示量', dataIndex: 'impressions', key: 'impressions', align: 'center' as const, width: 80 },
              { title: '竞胜展示率', dataIndex: 'winShowRate', key: 'winShowRate', align: 'center' as const, width: 90 },
              { title: '点击数', dataIndex: 'clicks', key: 'clicks', align: 'center' as const, width: 80 },
              { title: '点击率', dataIndex: 'ctr', key: 'ctr', align: 'center' as const, width: 80 },
              { title: 'cpc', dataIndex: 'cpc', key: 'cpc', align: 'center' as const, width: 70 },
            ]}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Waterfall;
