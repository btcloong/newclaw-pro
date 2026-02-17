"use client";

import { useState } from "react";
import { 
  BookOpen, Bot, Cpu, ChevronDown, GraduationCap, Clock, Star,
  Brain, FileText, Wrench, Rocket, CheckCircle2, ExternalLink, Code
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// 详细的学习内容数据
const agentPath = {
  id: "agent",
  title: "小白学 Agent",
  subtitle: "从零开始，7天掌握 AI Agent 开发",
  totalHours: 20,
  levels: [
    {
      day: "第1-2天",
      title: "Agent 基础概念",
      hours: 4,
      topics: [
        { 
          title: "什么是 AI Agent", 
          desc: "理解 Agent 的本质：感知-思考-行动循环",
          detail: `AI Agent 是一种能够感知环境、进行决策并执行行动的智能系统。

核心特征：
1. 自主性 - 能够独立运行，无需人工干预
2. 反应性 - 能够感知环境并实时响应
3. 主动性 - 能够主动追求目标
4. 社会性 - 能够与其他 Agent 或人类交互

市场数据：
- 2024年 AI Agent 市场规模达 50 亿美元
- 预计2030年增长至 2160 亿美元（CAGR 44.8%）
- AutoGPT GitHub 150k+ stars`
        },
        { 
          title: "LLM 基础", 
          desc: "了解大语言模型如何作为 Agent 的大脑",
          detail: `LLM 作为 Agent 大脑的原理：

关键技术：
1. 上下文学习 - 通过 prompt 提供示例学习新任务
2. 思维链 - 引导模型逐步推理
3. 函数调用 - 让模型调用外部工具

主流模型对比：
- GPT-4: 128K 上下文，推理能力强
- Claude 3.5: 200K 上下文，代码能力突出
- Llama 3.1: 128K 上下文，开源可商用
- Qwen 2.5: 128K 上下文，中文优化好`
        },
        { 
          title: "工具调用", 
          desc: "学习如何让 Agent 使用外部工具",
          detail: `工具调用的重要性：

没有工具的 LLM 只是"纸上谈兵"，工具调用让 Agent 能够：
- 获取实时信息（搜索、天气、股价）
- 执行代码（Python、SQL）
- 操作外部系统（发送邮件、创建日程）

常用工具：
- 搜索：Google Search、DuckDuckGo
- 计算：Python REPL、Wolfram Alpha
- 数据库：SQL、Vector DB

数据：使用工具的 Agent 比纯 LLM 准确率提升 40-60%`
        },
        { 
          title: "动手实验", 
          desc: "使用 Ollama 本地运行第一个模型",
          detail: `Ollama 安装和使用：

安装：
curl -fsSL https://ollama.com/install.sh | sh

常用命令：
ollama pull llama3.2    # 下载模型
ollama run llama3.2     # 运行模型
ollama list             # 查看已下载模型

API 调用：
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2",
  "prompt": "你好"
}'

硬件要求：
- 7B 模型：8GB 内存
- 13B 模型：16GB 内存`
        },
      ],
      code: `# 安装 Ollama
curl -fsSL https://ollama.com/install.sh | sh

# 下载并运行模型
ollama pull llama3.2
ollama run llama3.2`
    },
    {
      day: "第3-4天",
      title: "LangChain 实战",
      hours: 6,
      topics: [
        { 
          title: "LangChain 核心概念", 
          desc: "Chain、Prompt、Model、Output Parser",
          detail: `LangChain 核心组件：

1. Model I/O
   - Prompts: 提示词模板管理
   - Models: 支持多种 LLM
   - Output Parsers: 结构化输出

2. Chains
   - LLMChain: 最基本的链
   - Sequential Chain: 顺序执行
   - Router Chain: 路由到不同链

3. Memory
   - ConversationBufferMemory
   - ConversationSummaryMemory

市场地位：GitHub 70k+ stars，被 10,000+ 公司使用`
        },
        { 
          title: "构建第一个 Agent", 
          desc: "使用 LangChain 创建简单 Agent",
          detail: `Agent 类型：

1. Zero-shot ReAct
   - 最通用的 Agent 类型
   - 基于 ReAct 论文实现

2. Structured Chat
   - 支持多参数工具
   - 适合复杂工具调用

3. Conversational
   - 带记忆的对话 Agent

关键参数：
- max_iterations: 最大迭代次数
- handle_parsing_errors: 错误处理`
        },
        { 
          title: "添加工具", 
          desc: "集成搜索、计算器等工具",
          detail: `常用工具集成：

搜索工具：
- DuckDuckGo Search: 免费，无需 API Key
- Google Search: 需要 API Key，结果更准确

计算工具：
- Python REPL: 执行 Python 代码
- Calculator: 数学计算

数据库工具：
- SQL Database: 查询关系型数据库
- Vector DB: 语义搜索

自定义工具：
使用 @tool 装饰器定义自己的工具`
        },
        { 
          title: "记忆系统", 
          desc: "让 Agent 记住对话历史",
          detail: `记忆类型：

1. Buffer Memory
   - 保存完整对话历史
   - 简单直接，适合短对话

2. Summary Memory
   - 对历史进行摘要
   - 节省 Token，适合长对话

3. Entity Memory
   - 提取关键实体
   - 记住重要信息

4. Vector Store Memory
   - 基于向量检索
   - 找到相关历史

注意事项：
- 记忆会消耗 Token
- 长对话需要定期清理
- 敏感信息需要过滤`
        },
      ],
      code: `from langchain.agents import initialize_agent, Tool
from langchain.tools import DuckDuckGoSearchRun

search = DuckDuckGoSearchRun()
tools = [Tool(name="Search", func=search.run)]

agent = initialize_agent(tools, ChatOpenAI())
result = agent.run("今天天气怎么样？")`
    },
    {
      day: "第5-6天",
      title: "RAG 知识增强",
      hours: 6,
      topics: [
        { 
          title: "Embedding 原理", 
          desc: "文本如何变成向量",
          detail: `Embedding 技术：

将文本转换为数值向量，语义相似的内容在向量空间中距离相近。

主流模型：
- text-embedding-3-large: 3072维，性能最好
- BGE-large-zh: 1024维，中文优化
- M3E: 768维，开源免费

性能对比（MTEB）：
- text-embedding-3-large: 64.6%
- BGE-large-en: 64.1%
- text-embedding-ada-002: 61.0%`
        },
        { 
          title: "向量数据库", 
          desc: "使用 Chroma 存储和检索",
          detail: `向量数据库对比：

| 数据库 | 特点 | 适用场景 |
|--------|------|----------|
| Chroma | 轻量易用 | 本地开发 |
| Pinecone | 托管服务 | 生产环境 |
| Milvus | 开源高性能 | 大规模数据 |
| Qdrant | Rust实现 | 高性能需求 |

Chroma 使用：
client = chromadb.Client()
collection = client.create_collection("docs")
collection.add(documents=["text"])
results = collection.query(query_texts=["query"])`
        },
        { 
          title: "文档处理", 
          desc: "加载、切分、索引文档",
          detail: `文档处理流程：

1. 加载文档
   - TextLoader: 文本文件
   - PyPDFLoader: PDF文件
   - UnstructuredWordDocumentLoader: Word文件

2. 切分文档
   - chunk_size: 500-1000 tokens
   - chunk_overlap: 10-20%
   - RecursiveCharacterTextSplitter

3. 创建索引
   - 计算 Embedding
   - 存储到向量数据库`
        },
        { 
          title: "构建知识库", 
          desc: "让 Agent 基于私有数据回答",
          detail: `RAG 架构：

用户提问 → Embedding → 向量检索 → 获取文档 → 构建 Prompt → LLM生成

Prompt 模板：
基于以下上下文回答问题：
{context}

问题：{question}

请基于上下文回答，如果没有相关信息，请说"我不知道"。

优化技巧：
- Reranking: 使用更精确的模型重排序
- Query Expansion: 扩展查询词
- HyDE: 假设文档嵌入`
        },
      ],
      code: `from langchain import VectorDBQA
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma

embeddings = OpenAIEmbeddings()
vectordb = Chroma.from_documents(docs, embeddings)

qa = VectorDBQA.from_chain_type(llm=OpenAI(), vectorstore=vectordb)
answer = qa.run("公司的年假政策是什么？")`
    },
    {
      day: "第7天",
      title: "Multi-Agent 系统",
      hours: 4,
      topics: [
        { 
          title: "多 Agent 架构", 
          desc: "理解多 Agent 协作模式",
          detail: `协作模式：

1. Sequential（顺序）
   Agent A → Agent B → Agent C
   适合流水线任务

2. Hierarchical（层级）
   主管 Agent 分配任务
   执行 Agent 完成工作

3. Parallel（并行）
   多个 Agent 同时工作
   结果汇总

4. Collaborative（协作）
   Agent 之间可以通信
   共同解决问题`
        },
        { 
          title: "CrewAI 框架", 
          desc: "快速构建 Agent 团队",
          detail: `CrewAI 核心概念：

- Agent: 执行任务的智能体
- Task: 分配给 Agent 的任务
- Crew: Agent 和 Task 的集合
- Process: 执行流程

与 AutoGen 对比：
| 特性 | CrewAI | AutoGen |
|------|--------|---------|
| 易用性 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| 灵活性 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 适用场景 | 业务流程 | 复杂系统 |

选择建议：
快速原型用 CrewAI，复杂系统用 AutoGen`
        },
        { 
          title: "任务分配", 
          desc: "让不同 Agent 负责不同任务",
          detail: `任务设计原则：

1. 单一职责
   - 每个 Agent 只做一件事
   - 职责清晰，不重叠

2. 输入输出明确
   - 定义清晰的输入格式
   - 规定输出标准

3. 可委托
   - Agent 可以委托任务给其他 Agent
   - 设置委托权限和范围

角色定义：
角色：研究员
目标：收集和分析信息
背景：资深行业分析师
技能：搜索、数据分析`
        },
        { 
          title: "项目实战", 
          desc: "构建研报生成团队",
          detail: `项目：研报生成器

团队构成：
1. 研究员 - 收集信息，分析数据
2. 作家 - 撰写报告，组织内容
3. 编辑 - 审核内容，检查质量

工作流程：
研究员收集 → 作家撰写 → 编辑审核 → 输出报告

商业价值：
- 节省研究员 80% 时间
- 24/7 不间断监控
- 标准化报告格式`
        },
      ],
      code: `from crewai import Agent, Task, Crew

researcher = Agent(role="研究员", goal="收集资讯")
writer = Agent(role="作家", goal="撰写文章")

crew = Crew(agents=[researcher, writer])
result = crew.kickoff()`
    }
  ]
};

const modelPath = {
  id: "model",
  title: "AI 模型定制化",
  subtitle: "从使用模型到拥有专属模型",
  totalHours: 30,
  levels: [
    {
      day: "阶段一",
      title: "本地部署大模型",
      hours: 4,
      topics: [
        { title: "Ollama 入门", desc: "最简单的方式本地运行模型", detail: "Ollama 核心功能和硬件要求" },
        { title: "vLLM 部署", desc: "高性能模型服务", detail: "vLLM 的 PagedAttention 技术，吞吐量提升 10-20 倍" },
        { title: "模型量化", desc: "GGUF 格式和量化级别", detail: "Q4_K_M、Q5_K_M 等量化方案对比" },
        { title: "API 封装", desc: "提供 OpenAI 兼容接口", detail: "FastAPI 封装和负载均衡" },
      ],
      code: `python -m vllm.entrypoints.openai.api_server \\
  --model "Qwen/Qwen2.5-7B-Instruct" \\
  --tensor-parallel-size 1`
    },
    {
      day: "阶段二",
      title: "LoRA 高效微调",
      hours: 10,
      topics: [
        { title: "微调原理", desc: "理解 LoRA 和全参数微调的区别", detail: "LoRA 低秩适配原理，只训练 0.28% 参数" },
        { title: "数据准备", desc: "构建高质量的微调数据集", detail: "数据格式、清洗、增强" },
        { title: "LoRA 配置", desc: "rank、alpha、target_modules", detail: "r=16, alpha=32 等参数调优" },
        { title: "QLoRA 实践", desc: "在消费级 GPU 上微调大模型", detail: "4-bit 量化 + LoRA，8GB 显存微调 7B 模型" },
      ],
      code: `from transformers import AutoModelForCausalLM
from peft import LoraConfig, get_peft_model

model = AutoModelForCausalLM.from_pretrained("Qwen/Qwen2.5-7B")

lora_config = LoraConfig(r=16, lora_alpha=32)
model = get_peft_model(model, lora_config)
model.print_trainable_parameters()`
    },
    {
      day: "阶段三",
      title: "模型优化与导出",
      hours: 8,
      topics: [
        { title: "模型合并", desc: "将 LoRA 权重合并到基础模型", detail: "merge_and_unload() 方法" },
        { title: "量化导出", desc: "GPTQ、AWQ、GGUF 格式转换", detail: "不同量化格式的适用场景" },
        { title: "推理优化", desc: "使用 vLLM、TensorRT 加速", detail: "KV Cache、Continuous Batching" },
        { title: "模型评估", desc: "测试微调效果", detail: "MMLU、HumanEval、自定义评估" },
      ],
      code: `from peft import PeftModel

model = AutoModelForCausalLM.from_pretrained("base_model")
model = PeftModel.from_pretrained(model, "lora_adapter")
merged_model = model.merge_and_unload()`
    },
    {
      day: "阶段四",
      title: "高级定制技术",
      hours: 8,
      topics: [
        { title: "多模态微调", desc: "视觉-语言模型定制", detail: "LLaVA、Qwen-VL 微调" },
        { title: "RLHF 训练", desc: "基于人类反馈的强化学习", detail: "PPO、Reward Model" },
        { title: "DPO 训练", desc: "直接偏好优化", detail: "DPO vs RLHF，更简单高效" },
        { title: "模型融合", desc: "MergeKit 模型合并", detail: "SLERP、TIES、DARE 合并方法" },
      ],
      code: `from trl import DPOTrainer

trainer = DPOTrainer(
    model=model,
    ref_model=ref_model,
    train_dataset=dpo_dataset
)
trainer.train()`
    }
  ]
};

const knowledgeBase = {
  title: "AI 学习大全",
  concepts: [
    { name: "机器学习", desc: "监督/无监督/强化学习", detail: "ML 基础算法和应用场景" },
    { name: "深度学习", desc: "神经网络、CNN、RNN、Transformer", detail: "深度学习架构演进" },
    { name: "大语言模型", desc: "GPT、Claude、Llama 架构原理", detail: "Transformer、Attention 机制" },
    { name: "生成式 AI", desc: "文本/图像/音频/视频生成", detail: "Diffusion、GAN、VAE" },
    { name: "RAG", desc: "检索增强生成、向量数据库", detail: "Embedding、向量检索、重排序" },
    { name: "AI Agent", desc: "ReAct、工具使用、多 Agent 协作", detail: "Agent 架构和设计模式" },
  ],
  papers: [
    { name: "Attention Is All You Need", year: "2017", desc: "Transformer架构" },
    { name: "GPT-3", year: "2020", desc: "大模型里程碑" },
    { name: "InstructGPT", year: "2022", desc: "RLHF训练" },
    { name: "LLaMA", year: "2023", desc: "开源大模型" },
    { name: "ReAct", year: "2023", desc: "Agent架构" },
    { name: "RAG", year: "2020", desc: "检索增强生成" },
  ],
  tools: [
    { name: "PyTorch", desc: "深度学习框架" },
    { name: "Transformers", desc: "Hugging Face 模型库" },
    { name: "LangChain", desc: "LLM 应用框架" },
    { name: "LlamaIndex", desc: "RAG 开发框架" },
    { name: "Ollama", desc: "本地运行大模型" },
    { name: "vLLM", desc: "高性能推理引擎" },
  ],
  projects: [
    { name: "智能客服", difficulty: "⭐⭐", tech: "RAG, LangChain" },
    { name: "代码助手", difficulty: "⭐⭐⭐", tech: "Agent, GPT-4" },
    { name: "研报生成器", difficulty: "⭐⭐⭐", tech: "Multi-Agent" },
    { name: "个人知识库", difficulty: "⭐⭐", tech: "RAG" },
    { name: "模型微调", difficulty: "⭐⭐⭐⭐", tech: "LoRA" },
    { name: "多Agent协作", difficulty: "⭐⭐⭐⭐", tech: "AutoGen" },
  ]
};

export default function LearnPage() {
  const [activeTab, setActiveTab] = useState("agent");
  const [expandedLevel, setExpandedLevel] = useState<number | null>(0);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  const currentPath = activeTab === "agent" ? agentPath : activeTab === "model" ? modelPath : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-600 via-blue-600 to-green-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <GraduationCap className="w-10 h-10" />
              <span className="text-xl font-medium">NewClaw Learning Hub</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">AI 实战学习</h1>
            <p className="text-xl text-white/90 mb-8">三大学习路径，从入门到精通</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Three Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card 
              className={`cursor-pointer transition-all hover:shadow-lg ${activeTab === "agent" ? "ring-2 ring-purple-500" : ""}`}
              onClick={() => { setActiveTab("agent"); setExpandedLevel(0); setExpandedTopic(null); }}
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                  <Bot className="w-6 h-6 text-purple-600 dark:text-purple-300" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">小白学 Agent</h3>
                <p className="text-muted-foreground text-sm mb-4">从零开始，7天掌握 AI Agent 开发</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>20 小时 · 4 个阶段</span>
                </div>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer transition-all hover:shadow-lg ${activeTab === "model" ? "ring-2 ring-blue-500" : ""}`}
              onClick={() => { setActiveTab("model"); setExpandedLevel(0); setExpandedTopic(null); }}
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <Cpu className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">AI 模型定制化</h3>
                <p className="text-muted-foreground text-sm mb-4">从使用模型到拥有专属模型</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>30 小时 · 4 个阶段</span>
                </div>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer transition-all hover:shadow-lg ${activeTab === "knowledge" ? "ring-2 ring-green-500" : ""}`}
              onClick={() => { setActiveTab("knowledge"); setExpandedTopic(null); }}
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-green-600 dark:text-green-300" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">AI 学习大全</h3>
                <p className="text-muted-foreground text-sm mb-4">概念知识点 + 权威资源 + 实战教程</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="w-4 h-4" />
                  <span>6 大概念 · 6 篇论文</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content */}
          {currentPath ? (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2 text-foreground">{currentPath.title}</h2>
                <p className="text-xl text-muted-foreground">{currentPath.subtitle}</p>
              </div>

              <div className="space-y-4">
                {currentPath.levels.map((level, idx) => (
                  <Card key={idx} className={`overflow-hidden border ${expandedLevel === idx ? "ring-2 ring-purple-500 border-purple-500" : "border-border"}`}>
                    <CardHeader 
                      className="cursor-pointer hover:bg-muted/50 transition-colors" 
                      onClick={() => setExpandedLevel(expandedLevel === idx ? null : idx)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                          <span className="text-lg font-bold text-purple-600 dark:text-purple-300">{idx + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary">{level.day}</Badge>
                            <span className="text-sm text-muted-foreground">{level.hours} 小时</span>
                          </div>
                          <CardTitle className="text-lg text-foreground">{level.title}</CardTitle>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${expandedLevel === idx ? "rotate-180" : ""}`} />
                      </div>
                    </CardHeader>
                    
                    {expandedLevel === idx && (
                      <CardContent className="border-t border-border bg-muted/30">
                        <div className="grid lg:grid-cols-2 gap-6 pt-4">
                          <div>
                            <h4 className="font-semibold mb-4 text-foreground flex items-center gap-2">
                              <BookOpen className="w-5 h-5 text-purple-600" /> 
                              学习内容
                            </h4>
                            <div className="space-y-3">
                              {level.topics.map((topic: any, i: number) => (
                                <div key={i} className="border border-border rounded-lg overflow-hidden bg-card">
                                  <div 
                                    className="flex items-start gap-3 p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                                    onClick={() => setExpandedTopic(expandedTopic === `${idx}-${i}` ? null : `${idx}-${i}`)}
                                  >
                                    <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                                      <span className="text-xs font-medium text-purple-600 dark:text-purple-300">{i+1}</span>
                                    </div>
                                    <div className="flex-1">
                                      <div className="font-medium text-foreground">{topic.title}</div>
                                      <div className="text-sm text-muted-foreground">{topic.desc}</div>
                                    </div>
                                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform flex-shrink-0 ${expandedTopic === `${idx}-${i}` ? "rotate-180" : ""}`} />
                                  </div>
                                  
                                  {expandedTopic === `${idx}-${i}` && topic.detail && (
                                    <div className="px-3 pb-3">
                                      <div className="pl-9">
                                        <div className="p-3 bg-muted rounded-lg text-sm text-foreground whitespace-pre-line">
                                          {topic.detail}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-4 text-foreground flex items-center gap-2">
                              <Code className="w-5 h-5 text-purple-600" /> 
                              核心代码
                            </h4>
                            <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
                              <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                                <span className="text-xs text-gray-400">示例代码</span>
                                <span className="text-xs text-gray-500">Python / Bash</span>
                              </div>
                              <pre className="p-4 overflow-x-auto text-sm text-gray-100">
                                <code>{level.code}</code>
                              </pre>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2 text-foreground">{knowledgeBase.title}</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Brain className="w-5 h-5 text-green-600" /> 核心概念
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {knowledgeBase.concepts.map((item: any, idx: number) => (
                        <div key={idx} className="p-3 bg-muted rounded-lg">
                          <div className="font-medium text-foreground">{item.name}</div>
                          <div className="text-sm text-muted-foreground">{item.desc}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <FileText className="w-5 h-5 text-green-600" /> 必读论文
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {knowledgeBase.papers.map((paper: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                          <div className="w-8 h-8 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded flex items-center justify-center text-sm font-bold">
                            {paper.year.slice(-2)}
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{paper.name}</div>
                            <div className="text-sm text-muted-foreground">{paper.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Wrench className="w-5 h-5 text-green-600" /> 开发工具
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {knowledgeBase.tools.map((tool: any, idx: number) => (
                        <div key={idx} className="p-3 bg-muted rounded-lg">
                          <div className="font-medium text-foreground">{tool.name}</div>
                          <div className="text-sm text-muted-foreground">{tool.desc}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Rocket className="w-5 h-5 text-green-600" /> 实战项目
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {knowledgeBase.projects.map((project: any, idx: number) => (
                        <div key={idx} className="p-3 bg-muted rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-foreground">{project.name}</span>
                            <Badge variant="outline">{project.difficulty}</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">{project.tech}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
