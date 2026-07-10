using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using UnityEngine;
using UnityEngine.Serialization;

public class BindingWeb : BindingToken
{
    [SerializeField] private WebBrowser m_webBrowser;

    public override void BindToken(JToken token)
    {
        if (m_webBrowser == null)
        {
            LogWarning($"{gameObject}.m_txt_text == null)");
            return;
        }

        string url = token?.Type == JTokenType.Object
            ? token["Url"]?.ToString()
            : token?.ToString();

        string ut = token?.Type == JTokenType.Object
            ? token["UrlType"]?.ToString()
            : token?.ToString();

        m_webBrowser.URL = url ?? "";
        m_webBrowser.SetUrlType(ut);
    }

    public override JToken CollectJson()
    {
        return new JValue(m_webBrowser?.URL ?? "");
    }
}
