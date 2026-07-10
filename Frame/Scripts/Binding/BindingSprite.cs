using Newtonsoft.Json.Linq;
using UnityEngine;
using UnityEngine.UI;

public class BindingSprite : BindingToken
{
    [SerializeField] private Image m_image;
    public override void BindToken(JToken token)
    {
        string path = token?.Type == JTokenType.Object
            ? token["value"]?.ToString()
            : token?.ToString();

        var sprite = Resources.Load<Sprite>(path);
        m_image.sprite = sprite;
    }

    public override JToken CollectJson()
    {
        return new JValue($"{gameObject.name}图片资产地址");
    }
}
