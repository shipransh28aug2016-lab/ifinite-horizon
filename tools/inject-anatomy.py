#!/usr/bin/env python3
"""Inject tools/anatomy-module.js into index.html (idempotent). Run from repo root."""
import re
h=open('index.html',encoding='utf-8').read();m=open('tools/anatomy-module.js',encoding='utf-8').read()
A='/* ===== Realistic anatomy topics (eye, elbow joint, lungs) ====='
if A in h:
    i=h.index(A);j=h.index('\n})();\n',i)+len('\n})();\n');h=h[:i]+h[j:]
K='function Q_(k,l){cf[k]=l}\n})();\n'
assert h.count(K)==1
h=h.replace(K,K+m.rstrip()+'\n')
open('index.html','w',encoding='utf-8').write(h)
print('injected',len(m),'bytes')
