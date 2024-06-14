'use server';

const mock_server = 'http://localhost:3000';

const url = (uri: string) => new URL(uri, mock_server)

const uris = {
    build: '/cypress/build',
    sync: '/cypress/sync',
    page: '/cypress/page',
    data: '/cypress/data',
    action: '/cypress/action',
    caseList: '/cypress/caseList',
    case: '/cypress/case',
    save: '/cypress/case/save'
}

export async function build(name: string) {
    try {
        const req = url(uris.build);
        req.searchParams.append('name', name);
        const resp = await fetch(req);
        const data = await resp.json();
        return data;
    } catch (error) {
        return { ok: false, error: `${name}: ${error}` };
    }
}

export async function fetchPage() {
    try {
        const req = url(uris.page);
        const resp = await fetch(req);
        if (!resp.ok) throw '[!]Failed to fetch page options'
        const data = await resp.json();
        return data.catalog;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function fetchData(page: string) {
    try {
        const req = url(uris.data);
        req.searchParams.append('page', page);
        const resp = await fetch(req);
        if (!resp.ok) throw `[!]Failed to fetch page data: ${page}`
        const data = await resp.json();
        return data.data;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function fetchAction(page: string) {
    try {
        const req = url(uris.action);
        req.searchParams.append('page', page);
        const resp = await fetch(req);
        if (!resp.ok) throw `[!]Failed to fetch page actions: ${page}`
        const data = await resp.json();
        return data.actions;
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function fetchCaseList(source: string) {
    try {
        const req = url(uris.caseList);
        req.searchParams.append('source', source);
        const resp = await fetch(req);
        if (!resp.ok) throw `[!]Failed to fetch case list: ${source}`
        const data = await resp.json();
        return data.list;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function fetchLocalCaseList() {
    return fetchCaseList('local')
}

export async function fetchCloudCaseList() {
    return fetchCaseList('cloud')
}

export async function fetchCase(name: string) {
    try {
        const req = url(uris.case);
        req.searchParams.append('source', 'cloud-local');
        req.searchParams.append('name', name);
        const resp = await fetch(req);
        if (!resp.ok) throw `[!]Failed to fetch the test case: ${name}`
        const data = await resp.json();
        return data.case;
    } catch (error) {
        console.error(error);
        return '';
    }
}

export async function sync() {
    try {
        const req = url(uris.sync);
        const resp = await fetch(req);
        if (!resp.ok) throw `[!]Failed to sync with Cypress`
        const data = await resp.json();
        return data.ok;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function save(source: string, name: string, content: string) {
    try {
        if (source !== 'Local') throw `Not supported yet`
        if (!name.trim()) throw 'Null name'
        const req = url(uris.save);
        req.searchParams.append('source', source);
        req.searchParams.append('name', name);
        req.searchParams.append('content', content);
        const resp = await fetch(req);
        const data = await resp.json();
        return data;
    } catch (error) {
        return { ok: false, error: error };
    }
}