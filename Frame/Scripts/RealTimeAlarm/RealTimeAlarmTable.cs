using NonsensicalKit.Core;
using NonsensicalKit.Tools;
using System;
using System.Collections;
using System.Collections.Generic;
using NonsensicalKit.UGUI.Table;
using UnityEngine;

namespace Frame.RealTimeAlarm
{
    public class RealTimeAlarmTable : NonsensicalMono
    {
        [SerializeField] private ScrollView m_scrollView;
        [SerializeField] private RectTransform m_scrollRect;

        private Coroutine _coroutine;

        private bool _initialized;
        private readonly List<RealTimeAlarmInfo> datas = new List<RealTimeAlarmInfo>();

        private void Awake()
        {
            Subscribe<List<Frame.RealTimeAlarm.RealTimeAlarmInfo>>("refreshRealTimeAlarmTable", RefreshData);
        }

        private void RefreshData(List<Frame.RealTimeAlarm.RealTimeAlarmInfo> a)
        {
            if (this.gameObject.activeInHierarchy == false) return;
            datas.Clear();
            foreach (var info in a)
            {
                datas.Add(info);
            }

            Refresh();
        }

        private void Init()
        {
            var tempEleObj = m_scrollRect.transform.GetChild(0)?.GetComponent<RectTransform>();
            if (tempEleObj == null)
            {
                Debug.LogWarning("模板对象不存在");
                _initialized = false;
                return;
            }

            m_scrollView.SetTemplate(tempEleObj);

            m_scrollView.SetUpdateFunc((index, rectTransform) =>
            {
                try
                {
                    if (datas.Count == 0) return;
                    rectTransform.GetComponent<RealTimeAlarmElement>().SetValue(datas[index]);
                }
                catch (Exception e)
                {
                    Debug.LogError(e);
                }
            });

            m_scrollView.SetItemCountFunc(() => { return datas.Count; });

            // m_scrollView.UpdateData(false);
            _initialized = true;
        }

        private void Refresh()
        {
            if (_initialized == false)
            {
                Init();
            }

            if (_initialized == false) return;

            if (datas == null) return;
            if (_coroutine != null)
            {
                StopCoroutine(_coroutine);
                _coroutine = null;
            }

            m_scrollView.UpdateData(true);

            if (datas.Count < 2) return;
            if (!m_scrollView.IsDragging && m_scrollView.velocity.sqrMagnitude == 0)
            {
                var v = m_scrollView.GetScrollValue(datas.Count - 1, 1);
                m_scrollView.DoScrollTo(new Vector2(m_scrollView.horizontalNormalizedPosition, v), 0.5f);
            }
            /* m_scrollView.normalizedPosition.DoMove*/

            _coroutine = StartCoroutine(RollView());
        }

        int mul = 1;
        WaitForSeconds sleep8 = new WaitForSeconds(8);
        WaitForSeconds sleep5 = new WaitForSeconds(5);

        private IEnumerator RollView()
        {
            yield return null;
            yield return sleep8;
            if (datas.Count > 4)
            {
                int index = datas.Count - 2;
                while (true)
                {
                    m_scrollView.DoScrollTo(new Vector2(m_scrollView.horizontalNormalizedPosition, m_scrollView.GetScrollValue(index, 1)), 1f);
                    index -= 1 * mul;
                    yield return sleep5;
                    if (index == 0)
                        mul = -1;
                    if (index == datas.Count - 1)
                        mul = 1;
                }
            }
        }
    }
}
