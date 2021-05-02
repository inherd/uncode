# Uncode CDE（云研发体系开发环境）

Uncode is a **conceptual IDE** designed for the cloud development. Features:

 - Process as DSL
 - Everything as code, code as file.
 - IDE define process.

In this IDE, you can: manage Story, Story to Design (Architecture + UI), Design to Code, Code connect to Design, Zen Coding, development as Production.

(Chinese Introduction)

Uncode 是一个面向云研发时代设计的下一代概念性 IDE。特性：

 - 流程化为领域语言。Process as code
 - 一切皆文件。万物代码化
 - 开发环境即流程。

简单来说，你可以在这个 IDE 上完成：需求的编写，转换需求为设计，设计关联代码，禅模式编程，开发完即可上线。

![Design Principles](docs/design/design-principles.png)

## Roadmap

 - MVP 0.1
    - [ ] kanban in Uncode
    - [ ] design in Uncode
    - [ ] coding in Uncode
 - Milestone 1.0
    - [ ] kanban to coding
    - [ ] zen coding
    - [ ] story to Code
    - [ ] UI as Code

## Todo

 - [ ] multiple webview
 - [ ] DSL for features
 - [ ] distribution apps
 - [ ] GRPC for binary
    - [x] try `tarpc`?
    - [ ] try json rpc ?

## Setup

1. run `yarn start` in `uncode-ui`
2. run `yarn tauri dev` in root project

### Setup


License
---

@ 2020~2021 This code is distributed under the MIT license. See `LICENSE` in this directory.
