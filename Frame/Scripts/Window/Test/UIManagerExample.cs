using NaughtyAttributes;
using NonsensicalKit.Core;
using UnityEngine;

/// <summary>
/// 在任意脚本中打开窗口的示例
/// </summary>
public class UIManagerExample : MonoBehaviour
{
    [SerializeField] private string m_windowName;
    [SerializeField] private GameObject _characterDetailPrefab; // 内容预制体
    [SerializeField] private Sprite _characterAvatar;

    [Button]
    public void ShowCharacterDetail()
    {
        // 1. 定义窗口配置
        var config = new WindowConfig
        {
            Title = "角色详情",
            Icon = null, // 无图标
            Width = 600f,
            Height = 500f,
            AllowFullscreen = true,
            OnCloseCallback = () =>
            {
                Debug.Log("角色详情窗口已关闭，执行后续逻辑。");
            }
        };

        // 2. 定义内容参数
        var contentArgs = new CharacterDetailContent.CharacterArgs
        {
            CharacterName = "张三",
            Avatar = _characterAvatar,
            Description = "这是一段角色描述信息……"
        };

        // 3. 打开窗口
        if (IOCC.TryGet<WindowContainerManager>(m_windowName, out var window))
        {
            window.OpenWindow(config, _characterDetailPrefab, contentArgs);
        }
 
    }
}
