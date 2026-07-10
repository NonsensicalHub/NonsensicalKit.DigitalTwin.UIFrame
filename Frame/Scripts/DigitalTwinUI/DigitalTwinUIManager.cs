using System;
using System.Collections.Generic;
using System.Linq;
using NonsensicalKit.Core;
using NonsensicalKit.Core.Log;
using NonsensicalKit.Core.Service;
using NonsensicalKit.Tools.ObjectPool;
using UnityEngine;

[ServicePrefab("Services/DigitalTwinUIManager")]
public class DigitalTwinUIManager : NonsensicalMono, IMonoService
{
    [SerializeField] private DigitalTwinUIPrefabConfig[] m_prefabs;
    [SerializeField] private Canvas m_canvas;

    private Dictionary<string, GameObjectPoolMk2> _pools;

    public bool IsReady => true;

    public Action InitCompleted { get; set; }

    private void Awake()
    {
        _pools = new Dictionary<string, GameObjectPoolMk2>();
        foreach (var item in m_prefabs)
        {
            if (_pools.ContainsKey(item.Type))
            {
                LogCore.Warning("重复的UI类型");
                continue;
            }

            _pools.Add(item.Type, new GameObjectPoolMk2(item.Prefab, OnReset, OnInit));
        }

        InitCompleted?.Invoke();
    }


    private void OnInit(GameObject UIbase)
    {
        UIbase.SetActive(true);
    }

    private void OnReset(GameObject UIbase)
    {
        UIbase.SetActive(false);
    }

    public void Register(DigitalTwinUIInfo info)
    {
        if (_pools.ContainsKey(info.Type))
        {
            var go = _pools[info.Type].New();
            go.transform.SetParent(m_canvas.transform);

            if (go.TryGetComponent<IDigitalTwinUI>(out var v))
            {
                v.Init(info.Point, info.ID);
            }
            else
            {
                LogCore.Error("预制体顶节点为挂载所需的组件");
            }
        }
        else
        {
            LogCore.Warning($"类型：{info.Type} 的预制体尚未配置");
        }
    }
}

[Serializable]
public class DigitalTwinUIPrefabConfig
{
    public string Type;
    public GameObject Prefab;
}
