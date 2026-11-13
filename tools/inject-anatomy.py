#!/usr/bin/env python3
"""Inject the custom scene modules (tools/anatomy-module.js, tools/cell-module.js) into index.html. Idempotent. Run from repo root."""
h=open('index.html',encoding='utf-8').read()
K='function Q_(k,l){cf[k]=l}\n})();\n'
MODS=[('tools/anatomy-module.js','/* ===== Realistic anatomy topics'),('tools/cell-module.js','/* ===== Custom model sets 1-')]
for _,mark in MODS:
    if mark in h:
        i=h.index(mark);j=h.index('\n})();\n',i)+len('\n})();\n');h=h[:i]+h[j:]
assert h.count(K)==1
add=''.join(open(f,encoding='utf-8').read().rstrip()+'\n' for f,_ in MODS)
h=h.replace(K,K+add)
open('index.html','w',encoding='utf-8').write(h)
print('injected',len(add),'bytes')
