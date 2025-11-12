# vski·table

![Status](https://img.shields.io/badge/Status-pre--alpha-red)
![License](https://img.shields.io/badge/License-VSKI--SA-green)

A high performant data table for Preact.

![](./web/public/abstract.jpg)

## About

This is a pre-alpha software being shaped into something usable.

There's no a perfect table component, so I am making another one. This project
main goal is to make a state driven datagrid that enables user-agent feedback
flows. Extensibility and portability are also in priority, among other things.

```sh
deno run dev
```

## Architecture

There are no complex abstractions. There are callbacks, mutations and factories.
Plus some composition.

- The modules provide store (state), init and other hooks. 
- Preact signals are mainly used for state managment.
- The state is mutated using the dispatch method (provided by store).
- There's no context, the things done explicitly!
- There are addons (render hooks) as an alternative to slots.

## WIP

The project state is "pre-alpha". Meaning that everything is subject to change
and not everything is shaped to according to my vision yet.
