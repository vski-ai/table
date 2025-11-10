# vski·table

![Status](https://img.shields.io/badge/Status-pre--alpha-red)
![License](https://img.shields.io/badge/License-VSKI--SA-green)

A high performant data table for Preact.

![](./web/public/abstract.jpg)

## About

This is a pre-alpha software being shaped into something usable. 


There's no a perfect table component, so I am making another one. This project main goal is to make a state driven 
datagrid that enables user-agent feedback flows. Extensibility and portability are also in priority, among other things.


```sh
deno run dev
```

## Architecture

There are no complex abstractions. There are callbacks, mutations and factories. Plus some composition.

1. Module State (s) - factory expects callbacks provided by a module: state(p), persist(s), mutation(s), etc. The factory registers module state, persistence callback and mutation callback (dispatch).
2. Store Factory - the main interface is TableState which is to be extended by modules. Provides dispatch(cmd) callback. Most of the components accept `store` as an input. There's no context, things are done explicitly! 
3. Plugin Factory - expects an init callbacks and plugin name. Is executed after store initialization and before table render. Everything that has to be initialized before render make use of plugin interface (including store modules).
4. Table Factory - mates store, plugins and table view. then returns store instance and Table component.

## WIP

The project state is "pre-alpha", meaning that everything is subject to change, and not everything is shaped to according to my vision (yet).  