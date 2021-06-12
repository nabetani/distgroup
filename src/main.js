'use strict';

const getMembers = (src) => {
    console.log(src)
    return src[0].split("\t").slice(1).map((x)=>x.trim()).filter((x)=>0<x.length)
};

const revMap = (m)=>{
    const o={};
    for( let i=0 ; i<m.length ; i++ ){
        o[m[i]]=i;
    }
    return o;
};

const makeNewG = () => {
    const src = document.getElementById("src").value.split(/[\r\n]+/)
    const members = getMembers(src);
    const o = {
        members: members,
        mToIx: revMap(members),
    };
    console.log(o);
};
