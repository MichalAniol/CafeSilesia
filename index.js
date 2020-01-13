const diagram = document.getElementById('diagram'),
    breadcrumbs = document.querySelector('.breadcrumbs'),
    nodeH = 24;
var currentItem = diagram;

function createItem(parent, child) {
    let item = document.createElement('div');
    item.innerHTML = child.n;
    item.className = 'node';

    parent.appendChild(item);

    return item;
}

function goDeeper(parent, child) {
    for (let c of child) {
        let p = createItem(parent, c)
        if (c.c) {
            goDeeper(p, c.c)
        }
    }
}

goDeeper(diagram, data_a)

function checkHeight(item) {
    let h = item.getBoundingClientRect().height - 16;
    item.setAttribute('data-heightmemo', h)
    item.style.height = h + 'px';

    if (item.childNodes) {
        for (let c of item.childNodes) {
            if (c.tagName == 'DIV') {
                checkHeight(c)
            }
        }
    }
}

checkHeight(diagram)

document.querySelector('.wrap').addEventListener('click', (e) => {
    function getName(item) {
        let inner = item.innerHTML,
            end = inner.indexOf('<');
        if (end == -1) {
            return inner
        }
        return inner.slice(0, end);
    }

    function getParent(item) {
        return item.parentElement
    }

    let name = getName(e.target),
        node = e.target,
        parent = getParent(node);

    while (parent.id != 'diagram') {
        name = getName(parent) + ': ' + name;
        node = parent;
        parent = getParent(node);
    }

    breadcrumbs.innerHTML = name;

    setColor(e.target)

    document.querySelector('#diagram').style.height = "auto";
})

function setColor(item) {
    if (item != currentItem) {
        item.style.backgroundColor = 'var(--color_2)';
        currentItem.style.backgroundColor = 'var(--color_back)';
        currentItem = item;
    }
}

function changeHeight(item, h) {
    let parent = item.parentElement;
    if (parent.id != 'diagram') {
        let pH = Number(parent.getAttribute('data-heightmemo')) + h;
        parent.setAttribute('data-heightmemo', pH);
        parent.style.height = pH + 'px';
        changeHeight(parent, h);
    }
}

document.querySelector('.wrap').addEventListener('dblclick', (e) => {
    if (e.target.style.height == nodeH + 'px') {
        let h = e.target.getAttribute('data-heightmemo');
        e.target.style.height = h + 'px';
        changeHeight(e.target, (h - nodeH))

    } else {
        e.target.style.height = nodeH + 'px'
        let h = e.target.getAttribute('data-heightmemo');
        changeHeight(e.target, -(h - nodeH))
    }
})

function chnageData(name) {
    let list = document.getElementById('diagram');
    list.childNodes[0].remove();

    goDeeper(diagram, name)
    checkHeight(diagram)
    breadcrumbs.innerHTML = 'Strona głowna'
}