using System;
using UnityEngine;

public enum UrlType
{
    Http,
    StreamingAssets,
    File
} 
////// <summary>
/// 网页浏览器 
/// </summary>
public partial class WebBrowser : MonoBehaviour
{
    [SerializeField] protected UrlType m_urlType=UrlType.StreamingAssets;
    [SerializeField] private string m_url;

    public string URL
    {
        get => DealWithUrl(m_url);
        set => m_url =value; 
    }
   
    private void Awake()
    {
        Init();
    }

    public void SetUrlType(string urlType )
    {
        string t=urlType.ToLower();
        m_urlType = t switch
        {
            "http" => UrlType.Http,
            "streamingassets" => UrlType.StreamingAssets,
            "file" => UrlType.File,
            _ => UrlType.File,
        };
    }
    
    public partial void LoadUrl(string url);
    private partial void Init();
    private partial string DealWithUrl(string url);
    

}
