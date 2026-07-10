using System;
using TMPro;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;

namespace ZTools
{
    public class ZCalendarDayItem : MonoBehaviour, IPointerEnterHandler, IPointerExitHandler
    {
        [SerializeField, Tooltip("自定义时间段标记")] private bool cus;
        public GameObject imgBk;
        public GameObject rangeBk;
        public TMP_Text txt;
        public Button btn;
        public TMP_Text lunarTxt;

        [SerializeField] private GameObject _left;
        [SerializeField] private GameObject _right;

        [HideInInspector]
        public ZCalendarController zCalendarController;
        private bool isCanClick = true;
        public int Year { get; set; }
        public int Month { get; set; }
        public int Day { get; set; }
        public DateTime dateTime;
        private bool isOn = false;
        Color crtDayColor;
        Color crtLunarColor;
        public bool IsOn
        {
            set
            {
                if (isOn != value || isOn)
                {
                    isOn = value;
                    imgBk?.SetActive(value);
                    if (value)
                    {
                        if (!zCalendarController.IsInRange)
                        {
                            zCalendarController.zCalendar.DayClick(this.dateTime);
                        }
                        if (zCalendarController.zCalendarModel.rangeCalendar)
                        {
                            zCalendarController.ChangeRangeType(this.dateTime);
                        }
                        if (zCalendarController.zCalendarModel.isPopupCalendar && zCalendarController.isInit && !zCalendarController.zCalendarModel.rangeCalendar)
                        {
                            zCalendarController.Hide();
                        }
                    }
                }
            }
            get { return isOn; }
        }
        public bool IsOnWithOutEvent
        {
            set
            {
                if (isOn != value)
                {
                    isOn = value;
                    imgBk?.SetActive(value);
                }
            }
        }
        private bool isRange;
        public bool IsRange
        {
            set
            {
                if (isRange != value)
                {
                    isRange = value;
                    rangeBk?.SetActive(value);
                }
            }
            get { return isRange; }
        }
        Color greyColor;
        private void Awake()
        {
            crtDayColor = txt.color;
            crtLunarColor = lunarTxt.color;
        }
        /// <summary>
        /// 初始化日期
        /// </summary>
        /// <param name="year">年</param>
        /// <param name="month">月</param>
        /// <param name="day">日</param>
        /// <param name="nowTime"></param>
        /// <param name="crtDay">当前天</param>
        public void Init(DateTime dateTime, DateTime crtDay)
        {
            enabled = true;
            //isRange = rangeBk.activeInHierarchy;
            //isOn = imgBk.activeInHierarchy;
            IsOnWithOutEvent = false;
            IsRange = false;
            this.dateTime = dateTime;
            this.Year = dateTime.Year;
            this.Month = dateTime.Month;
            this.Day = dateTime.Day;
            btn.interactable = true;
            txt.color = crtDayColor;
            lunarTxt.color = crtLunarColor;
            txt.text = Day.ToString("00");

            if (!zCalendarController.zCalendarModel.rangeCalendar)
            {
                IsOn = (DateTime.Compare(dateTime, crtDay) == 0);
            }
            else
            {
                zCalendarController.zCalendar.RangeTimeChangedDayItemListenerEvent += RangeTimeEvent;
            }
            if (!zCalendarController.zCalendarModel.isStaticCalendar)
            {
                btn.onClick.AddListener(() =>
                {
                    IsOn = true;
                });
                zCalendarController.zCalendar.dayValueChangedDayItemListenerEvent += ChangeState;
            }
            isCanClick = !zCalendarController.zCalendarModel.isStaticCalendar;
            greyColor = zCalendarController.greyColor.a == 0 ? new Color(txt.color.r, txt.color.g, txt.color.b, 0.1f) : zCalendarController.greyColor;

            if (!zCalendarController.zCalendarModel.isUnexpiredTimeCanClick)
                IsUnexpiredTime(zCalendarController.nowTime, dateTime);
            if (zCalendarController.zCalendarModel.autoFillDate)
            {
                IsCrtMonth(zCalendarController.Month);
            }
            if (zCalendarController.zCalendarModel.lunar)
            {
                lunarTxt.gameObject.SetActive(true);
                SolarToLunar(dateTime);
            }

            if (cus)
            {
                zCalendarController.zCalendar.cusClear += () =>
                {
                    lunarTxt.text = "";
                    _left.gameObject.SetActive(false);
                    _right.gameObject.SetActive(false);
                };
            }
        }
        /// <summary>
        /// 关闭可点击权限
        /// </summary>
        public void CloseClickAble()
        {
            isRange = rangeBk.activeInHierarchy;
            isOn = imgBk.activeInHierarchy;
            IsOn = false;
            txt.text = "";
            enabled = false;
            IsOnWithOutEvent = false;
            IsRange = false;
        }
        /// <summary>
        /// 判断是否在选择区间内的时间
        /// </summary>
        public void IsRangeDayItem(DateTime d1, DateTime d2)
        {
            if (DateTime.Compare(d1, dateTime) == 0 || DateTime.Compare(d2, dateTime) == 0)
            {
                IsOnWithOutEvent = true;
            }
            else
            {
                RangeTimeEvent(d1, d2);
            }
        }

        /// <summary>
        /// 自定义时间段落标记
        /// </summary>
        /// <param name="d1"></param>
        /// <param name="d2"></param>
        private void Cus(DateTime d1, DateTime d2)
        {
            int a = DateTime.Compare(d1, d2);
            if (a == 0) return;
            if (DateTime.Compare(dateTime, d1) == 0)
            {
                if (a < 0)
                {
                    IsLeft();
                }
                else
                {
                    IsRight();
                }
            }
            else
            {
                if (a < 0)
                {
                    IsRight();
                }
                else
                {
                    IsLeft();
                }
            }
            void IsLeft()
            {
                lunarTxt.text = "开始";
                _left.gameObject.SetActive(true);
                _right.gameObject.SetActive(false);
            }
            void IsRight()
            {
                lunarTxt.text = "结束";
                _left.gameObject.SetActive(false);
                _right.gameObject.SetActive(true);
            }
        }
        /// <summary>
        /// 判断当前是否在区域选择时间内
        /// </summary>
        /// <param name="d1"></param>
        /// <param name="d2"></param>
        void RangeTimeEvent(DateTime d1, DateTime d2)
        {
            if (DateTime.Compare(d1, dateTime) < 0 && DateTime.Compare(d2, dateTime) > 0)
            {
                IsRange = true;
            }

            if (DateTime.Compare(d1, dateTime) == 0 || DateTime.Compare(d2, dateTime) == 0)
            {
                if (zCalendarController.IsInRange) return;
                if (cus)
                {
                    Cus(d1, d2);
                }
            }
        }
        /// <summary>
        /// 改变当前状态
        /// </summary>
        void ChangeState(DateTime dayItem)
        {
            if (dayItem != this.dateTime)
            {
                IsOn = false;
                IsRange = false;
            }
        }

        public void OnPointerEnter(PointerEventData eventData)
        {
            if (!isOn && isCanClick)
            {
                imgBk.SetActive(true);
            }
        }

        public void OnPointerExit(PointerEventData eventData)
        {
            if (!isOn && isCanClick)
            {
                imgBk.SetActive(false);
            }
        }
        /// <summary>
        /// 判断是否超过了今天的时间
        /// </summary>
        void IsUnexpiredTime(DateTime time, DateTime crtTime)
        {
            int compNum = DateTime.Compare(time, crtTime);
            if (compNum < 0)
            {
                btn.interactable = false;
                isCanClick = false;
                txt.color = greyColor;
                lunarTxt.color = greyColor;
            }
        }
        /// <summary>
        /// 判断是否为本月日期
        /// </summary>
        void IsCrtMonth(int time)
        {
            if (time != Month)
            {
                btn.interactable = false;
                isCanClick = false;
                txt.color = greyColor;
                lunarTxt.color = greyColor;
            }
        }
        /// <summary>
        /// 显示农历日期
        /// </summary>
        /// <param name="time"></param>
        void SolarToLunar(DateTime dt)
        {
            int year = zCalendarController.cncld.GetYear(dt);
            int flag = zCalendarController.cncld.GetLeapMonth(year);
            int month = zCalendarController.cncld.GetMonth(dt);
            if (flag > 0)
            {
                if (flag == month)
                {
                    //闰月
                    month--;
                }
                else if (month > flag)
                {
                    month--;
                }
            }
            int day = zCalendarController.cncld.GetDayOfMonth(dt);
            lunarTxt.text = (day == 1) ? GetLunarMonth(month) : GetLunarDay(day);
            //Debug.Log($"{year}-{(month.ToString().Length == 1 ? "0" + month : month + "")}-{(day.ToString().Length == 1 ? "0" + day : day + "")}");
        }
        /// <summary>
        /// 获取农历月
        /// </summary>
        /// <param name="month"></param>
        /// <returns></returns>
        string GetLunarMonth(int month)
        {
            if (month < 13 && month > 0)
            {
                return $"{zCalendarController.lunarMonths[month - 1]}月";
            }

            throw new ArgumentOutOfRangeException("无效的月份!");
        }
        /// <summary>
        /// 获取农历年
        /// </summary>
        /// <param name="day"></param>
        /// <returns></returns>
        string GetLunarDay(int day)
        {
            if (day > 0 && day < 32)
            {
                if (day != 20 && day != 30)
                {
                    return string.Concat(zCalendarController.lunarDaysT[(day - 1) / 10], zCalendarController.lunarDays[(day - 1) % 10]);
                }
                else
                {
                    return string.Concat(zCalendarController.lunarDays[(day - 1) / 10], zCalendarController.lunarDaysT[1]);
                }
            }
            throw new ArgumentOutOfRangeException("无效的日!");
        }
        public void OnDestroy()
        {
            if (!zCalendarController.zCalendarModel.isStaticCalendar)
            {
                btn.onClick.RemoveAllListeners();
            }
        }
    }
}
