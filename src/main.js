const $siteList = $('.siteList')
const $lastLi = $siteList.find('li.last')
const x = localStorage.getItem('x')
    //将字符串重新变成对象
const xObject = JSON.parse(x)
    //如果xObject存在就用，不存在使用默认初始值
const hashMap = xObject || [{ logo: 'B', url: 'https://www.bilibili.com' },
    { logo: 'W', url: 'https://weibo.com' },
    { logo: 'T', url: 'https://www.taobao.com' }

];
const simplifyUrl = (url) => {
    return url.replace('https://', '')
        .replace('http://', '')
        .replace('www.', '')
        .replace(/\/.*/, '') //删除/开头的

}
const render = () => {
    $siteList.find('li:not(.last)').remove()
    hashMap.forEach((node, index) => { //获得node的索引
        const $li = $(`<li>
                    <div class="site">
                        <div class="logo">${node.logo}</div>
                        <div class="link">${simplifyUrl(node.url)}</div>
                        <div class='close'>
                        <svg class="icon">
                           <use xlink:href="#iconclose"></use>
                        </svg>
                        </div>
                    </div>
    </li>`).insertBefore($lastLi)
        $li.on('click', () => { //将a标签改为触动自身
            window.open(node.url)
        })
        $li.on('click', '.close', (e) => {
            e.stopPropagation() // 此处点击close就会触动a标签进行跳转需要阻止此冒泡行为 
            hashMap.splice(index, 1)
            render()
        })
    })
}
render()
$('.addButton')
    .on('click', () => {
        let url = window.prompt('请问添加网址的是？')
        if (url.indexOf('http') !== 0) {
            url = 'https://' + url
        } //toUpperCase转换成大写，也可在CSS设置text-transform:uppercase
        hashMap.push({
            logo: simplifyUrl(url)[0].toUpperCase(),
            logoType: 'test',
            url: url
        })

        render()
    })
    //当窗口即将被关闭时会触发该事件
window.onbeforeunload = () => {
        console.log('页面要关闭了')
            //local storage只能存字符串,因此将对象转换成字符串,不清楚可以用typeof
        const string = JSON.stringify(hashMap)
        localStorage.setItem('x', string)
    }
    //键盘监听事件
$(document).on('keypress', (e) => {
    const { key } = e //const key = e.key
    for (let i = 0; i < hashMap.length; i++) {
        if (hashMap[i].logo.toLowerCase() === key) {
            window.open(hashMap[i].url)
        }
    }
})