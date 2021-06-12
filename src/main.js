'use strict';

const getMembers = (src) => {
    return src[0].split("\t").slice(1).map((x) => x.trim()).filter((x) => 0 < x.length)
};
const keyValue = (a, b) => {
    const n = 1000000;
    return (a < b) ? a * n + b : b * n + a;
};
const collectGroups = (src, members) => {
    const o = [];
    const nameSet = new Set();
    const names = [];
    const nameToIx = {};
    const addName = (n) => {
        if (!nameSet.has(n)) {
            nameSet.add(n);
            names.push(n);
            nameToIx[n] = names.length - 1;
        }
    };
    for (const n of members) {
        addName(n);
    }
    const add = (w, e) => {
        for (const n of e) {
            addName(n);
        }
        o.push({ w: w, m: e.map((n) => nameToIx[n]) });
    };
    for (const line of src.slice(1)) {
        let split = line.split(/\t\t+/);
        let w = null;
        for (const etext of split) {
            const e = etext.split("\t").map((x) => x.trim()).filter((x) => 0 < x.length)
            if (w === null) {
                w = parseFloat(e[1]);
                add(w, e.slice(2));
            } else {
                add(w, e);
            }
        }
    }
    return [names, o];
};

const getWeights = (g) => {
    const w = {};
    for (const e of g) {
        for (let a = 0; a < e.m.length; ++a) {
            const ka = e.m[a];
            for (let b = a + 1; b < e.m.length; ++b) {
                const kb = e.m[b];
                const key = keyValue(ka, kb);
                w[key] ||= 0;
                w[key] += e.w;
            }
        }
    }
    return w;
};

const elementInt= (id)=>{
    const e = document.getElementById(id);
    return parseInt(e.value);
}

const parseInput = () => {
    const src = document.getElementById("src").value.split(/[\r\n]+/)
    const members = getMembers(src);
    let [names, groups] = collectGroups(src, members);
    const input = {
        members: members,
        names: names,
        groups: groups,
        trial: elementInt("trial_count"),
        gcount: elementInt("group_count"),
    };
    return input;
};

const shuffled_indices= (a)=>{
    const ix = [...a.keys()];
    const orders = ix.map(()=>Math.random());
    ix.sort((ia,ib)=>{
        const oa = orders[ia];
        const ob = orders[ib];
        return (oa<ob) - (ob<oa);
    });
    return ix;
};

const createCandidate = (i)=>{
    const s = shuffled_indices(i.members);
    const g = Array.from(Array(i.gcount)).map(()=>[]);
    for( let ix=0 ; ix<s.length ; ix++){
        g[ix % g.length].push(s[ix]);
    }
    return g;
};

const scoreOf = (c,weights)=>{
    let s=0;
    for( const g of c){
        for( let ia=0 ; ia<g.length ; ++ia ){
            for( let ib=ia+1 ; ib<g.length ; ++ib ){
                s += weights[keyValue(g[ia], g[ib])] || 0;
            }
        }
    }
    return s;
};

const getCandidates = (input)=>{
    const weights = getWeights(input.groups);
    const clist=[];
    for( let i=0 ; i<input.trial ; i++){
        const c = createCandidate(input);
        clist.push( { score:scoreOf(c,weights), m:c});
    }
    clist.sort((a,b)=>{
        const sa = a.score;
        const sb = b.score;
        return (sb<sa)-(sa<sb);
    })
    return clist;
};

const stringize = (c,i)=>{
    console.log(c);
    return c.m.map( (g)=>{
        return g.map( (ix)=>i.names[ix] ).join("\t");
    }).join("\t\t");
};

const makeNewG = () => {
    const input = parseInput();
    const candidate = getCandidates(input)[0];
    const s = stringize(candidate,input);
    document.getElementById("result").value = "\t\t"+s;
};

const copy = ()=>{
    const str = document.getElementById("result").value;
    if(navigator.clipboard){
        navigator.clipboard.writeText(str);
    }
};

const input_sample = ()=>{
    document.getElementById("src").value = document.getElementById("sample").value;

}