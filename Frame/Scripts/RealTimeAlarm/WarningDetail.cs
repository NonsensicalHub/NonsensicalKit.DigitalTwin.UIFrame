using System.Collections.Generic;
using Frame.RealTimeAlarm;
using NonsensicalKit.Tools.ObjectPool;
using NonsensicalKit.UGUI;
using UnityEngine;

public class WarningDetail : NonsensicalUI
{
    [SerializeField] private GameObject m_warningDetailCellPrefab;
    [SerializeField] private Transform m_pool;

    private GameObjectPoolMk2 _pool;

    protected override void Awake()
    {
        base.Awake();
        Subscribe<RealTimeAlarmInfo>("showRealTimeAlarmDetail", OnShow);
        Subscribe<int>("showRealTimeAlarm", OnShow);
        InitScrollView();
    }


    private void InitScrollView()
    {
        _pool = new GameObjectPoolMk2(m_warningDetailCellPrefab, resetAction: OnCellReset, initAction: OnCreateCell);
    }

    private void OnShow(int obj)
    {
        var resolve = Execute<int, List<(string, string)>>("getSolutionByInt", obj);
        ShowDetail(resolve);
    }

    private void OnShow(RealTimeAlarmInfo info)
    {
        var resolve = Execute<RealTimeAlarmInfo, List<(string, string)>>("getSolution", info);
        ShowDetail(resolve);
    }

    private void ShowDetail(List<(string, string)> info)
    {
        _pool.Clear();
        if (info is { Count: > 0 })
        {
            foreach (var tuple in info)
            {
                _pool.New().GetComponent<WarningDetailCell>()?.SetText(tuple);
            }
        }


        OpenSelf();
    }

    private void OnCreateCell(GameObject cell)
    {
        cell.transform.SetParent(m_warningDetailCellPrefab.transform.parent, false);
        cell.SetActive(true);
    }

    private void OnCellReset(GameObject cell)
    {
        cell.transform.SetParent(m_pool);
        cell.SetActive(false);
    }
}
