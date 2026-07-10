#if UNITY_EDITOR|| UNITY_STANDALONE_WIN || True
using System;
using NonsensicalKit.UGUI;
using UnityEngine;
using Vuplex.WebView;

/// <summary>
/// 需要导入3D Web View插件 
/// </summary>
public partial class WebBrowser
{
    public CanvasWebViewPrefab m_WebViewPrefab;

    private partial void Init()
    {
        if (m_WebViewPrefab == null)
        {
            var g = Resources.Load<GameObject>("CanvasWebViewPrefab");
            if (g == null)
            {
                Debug.LogWarning("Canvas WebView prefab could not be found.");
            }

            var gg = Instantiate(g, this.transform);
            gg.GetComponent<RectTransform>().Stretch();
            m_WebViewPrefab = gg.GetComponent<CanvasWebViewPrefab>();
        }

        m_WebViewPrefab.InitialUrl = URL;
    }

    private partial string DealWithUrl(string url)
    {
        return m_urlType switch
        {
            UrlType.Http => url,
            UrlType.StreamingAssets => $"streaming-assets://{url}",
            UrlType.File => $"file://{url}",
            _ => throw new ArgumentOutOfRangeException()
        };
    }

    public partial void LoadUrl(string url)
    {
        if (string.IsNullOrEmpty(url))
        {
            Debug.LogWarning("url is null or empty");
            return;
        }

        URL = url;

        m_WebViewPrefab.WebView.LoadUrl(URL);
    }
}
#endif
