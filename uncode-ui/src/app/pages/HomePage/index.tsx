import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { NavBar } from 'app/components/NavBar';
import { PageWrapper } from 'app/components/PageWrapper';
import ReactMarkdown from 'react-markdown';
const gfm = require('remark-gfm');

export function HomePage() {
  const markdown = `# Uncode CDE（云研发体系开发环境）

Uncode 是一个面向云研发时代设计的下一代概念性 IDE。特性：

 - 流程化为领域语言。Process as code
 - 一切皆文件。万物代码化
 - 开发环境即流程。
基础要素：

1. 开发即部署。即 local dev 便是 dev server，可直接接入现有的系统。
2. 万物即 DSL。具备一定等级的程序语言设计能力。
3. API 的 API。即将现有的内部、外部 API 进行抽象化设计，以提供快速可用的 API。

架构设计：

 - 模块化。
 - 管理和过滤器。主要进行领域特定语言的设计
 - 搭档模式（sidecar）。将诸如语言解析等独立为进程，通过进程调用来实现跨平台
 - 容器桥。将 UI 展示与逻辑相隔离，让 IDE 的大部分组件与 UI 无关。
`;

  return (
    <>
      <Helmet>
        <title>Uncode - 云研发 IDE</title>
        <meta name="description" content="cloud dev IDE" />
      </Helmet>
      <NavBar />
      <PageWrapper>
        <ReactMarkdown remarkPlugins={[gfm]} children={markdown} />
      </PageWrapper>
    </>
  );
}
