using NonsensicalKit.UGUI;
using System;
using TMPro;
using UnityEngine;
using ZTools;
/// <summary>
/// 使用示例
/// </summary>

public class ZCalendarDemo : NonsensicalUI
{

    public ZCalendar zCalendar;

    private string selectTime;
    [SerializeField] private TMP_Text startTime;
    [SerializeField] private TMP_Text endTime;

    private ZCalendarModel zModel;

    public Func<string, string> SetTime;

    private DateTime start;
    private DateTime end;
    public string SelectTime
    {
        get { return selectTime; }
        set
        {
            selectTime = value;
            SetTime.Invoke(selectTime);
        }
    }

    protected override void Awake()
    {
        zCalendar.onDayRefresh.AddListener(ZCalendar_UpdateDateEvent);
        zCalendar.onDayValueChanged.AddListener(ZCalendar_ChoiceDayEvent);
        zCalendar.onRangeTimeValueChanged.AddListener(ZCalendar_RangeTimeEvent);
        zCalendar.onComplete.AddListener(ZCalendar_CompleteEvent);
        //zCalendar.RefreshDate("2023-10-01", "2023-11-21");
        //zCalendar.RefreshDate(System.DateTime.Now);
        //zCalendar.RefreshDate("2022-02-02");
        //zCalendar.Show();
        //zCalendar.Hide();
        zModel = GetComponent<ZCalendarModel>();
        startTime.text = DateTime.Now.ToString();
        endTime.text = DateTime.Now.ToString();
        SetTime = (v) => { return v; };
    }

    public string GetDatesWithTime()
    {
        return $"{startTime.text:yyyy-MM-dd HH:mm:ss}+{endTime.text:yyyy-MM-dd HH:mm:ss}";
    }
    public string GetDatesWithoutTime()
    {
        return $"{startTime.text:yyyy - MM - dd}+{endTime.text:yyyy - MM - dd}";
    }

    public string GetDate()
    {
        return $"{startTime.text:yyyy - MM - dd}";
    }
    /// <summary>
    /// 加载结束
    /// </summary>
    private void ZCalendar_CompleteEvent()
    {
        Debug.Log("ZCalendar加载结束");
        if (null != zCalendar.CrtTime)
        {
            Debug.Log($"当前时间{zCalendar.CrtTime.Day}");
        }
    }

    /// <summary>
    /// 区间时间
    /// </summary>
    /// <param name="arg1"></param>
    /// <param name="arg2"></param>
    private void ZCalendar_RangeTimeEvent(DateTime arg1, DateTime arg2)
    {
        if (zModel.timeChoice)
        {
            Debug.Log($"选择的时间区间：{arg1:yyyy-MM-dd HH:mm:ss}到{arg2:yyyy-MM-dd HH:mm:ss}");
            startTime.text = arg1.ToString("yyyy-MM-dd HH:mm:ss");
            endTime.text = arg2.ToString("yyyy-MM-dd HH:mm:ss");
        }
        else
        {
            Debug.Log($"选择的日期区间：{arg1:yyyy-MM-dd}到{arg2:yyyy-MM-dd}");
            startTime.text = arg1.ToString("yyyy-MM-dd");
            endTime.text = arg2.ToString("yyyy-MM-dd");
        }
        SelectTime = $"{startTime.text:yyyy - MM - dd HH: mm: ss}+{endTime.text:yyyy - MM - dd HH: mm: ss}";
    }

    /// <summary>
    /// 获取选择的日期
    /// </summary>
    /// <param name="obj"></param>
    private void ZCalendar_ChoiceDayEvent(DateTime obj)
    {
        if (zModel.timeChoice)
        {
            zCalendar.isFirstSelect = true;
            Debug.Log($"选择的时间：{obj:yyyy-MM-dd HH:mm:ss}");
            startTime.text = obj.ToString("yyyy-MM-dd HH:mm:ss");
            endTime.text ="";
        }
        else
        {
            Debug.Log($"选择的日期：{obj:yyyy-MM-dd}");
            startTime.text = obj.ToString("yyyy-MM-dd");
        }
        SelectTime = startTime.text;
    }
    /// <summary>
    /// 切换月份时，可拿到每一天的item对象
    /// </summary>
    /// <param name="obj"></param>
    private void ZCalendar_UpdateDateEvent(DateTime obj)
    {
        //Debug.Log($"加载日期：{obj.Day}");
    }
}
