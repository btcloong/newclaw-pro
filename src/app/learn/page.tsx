"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  Code, 
  Brain, 
  Cpu, 
  Bot, 
  Database,
  ExternalLink,
  ChevronRight,
  Play,
  GraduationCap,
  Lightbulb,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// 概念数据
const concepts = [
  {
    category: "基础概念",
    icon: BookOpen,
    items: [
      { name: "机器学习", desc: "监督/无监督/强化学习", level: "入门" },
      { name: "深度学习", desc: "神经网络、CNN、RNN、Transformer", level: "入门" },
      { name: "大语言模型", desc: "GPT、Claude、Llama架构", level: "中级" },
      { name: "生成式AI", desc: "文本/图像/音频/视频生成", level: "中级" },
    ]
  },
  {
    category: "进阶技术",
    icon: Cpu,
    items: [
      { name: "模型优化", desc: "量化、蒸馏、剪枝、LoRA", level: "高级" },
      { name: "RAG", desc: "检索增强生成、向量数据库", level: "中级" },
      { name: "AI Agent", desc: "ReAct、工具使用、多Agent协作", level: "高级" },
      { name: "多模态", desc: "视觉-语言模型、跨模态理解", level: "高级" },
    ]
  },
  {
    category: "开发工具",
    icon: Code,
    items: [
      { name: "PyTorch/TensorFlow", desc: "深度学习框架", level: "中级" },
      { name: "Transformers", desc: "Hugging Face模型库", level: "中级" },
      { name: "LangChain", desc: "LLM应用开发框架", level: "中级" },
      { name: "LlamaIndex", desc: "RAG和数据处理", level: "中级" },
    ]
  }
];

// 课程资源
const courses = [
  {
    title: "机器学习 - 吴恩达",
    platform: "Coursera",
    level: "入门",
    link: "https://www.coursera.org/learn/machine-learning",
    description: "最经典的机器学习入门课程"
  },
  {
    title: "Fast.ai 深度学习",
    platform: "fast.ai",
    level: "入门",
    link: "https://www.fast.ai/",
    description: "实战导向的深度学习课程"
  },
  {
    title: "Hugging Face NLP",
    platform: "Hugging Face",
    level: "中级",
    link: "https://huggingface.co/course",
    description: "Transformer模型和NLP实战"
  },
  {
    title: "CS224N NLP",
    platform: "Stanford",
    level: "高级",
    link: "https://web.stanford.edu/class/cs224n/",
    description: "斯坦福自然语言处理课程"
  },
  {
    title: "LangChain 官方教程",
    platform: "LangChain",
    level: "中级",
    link: "https://python.langchain.com/docs/get_started/quickstart",
    description: "LLM应用开发完整指南"
  },
  {
    title: "OpenAI Cookbook",
    platform: "OpenAI",
    level: "中级",
    link: "https://cookbook.openai.com/",
    description: "API使用和最佳实践"
  }
];

// 实战项目
const projects = [
  {
    title: "智能客服系统",
    difficulty: "⭐⭐",
    tech: ["RAG", "LangChain", "Vector DB"],
    description: "基于文档的问答系统，支持企业知识库"
  },
  {
    title: "代码生成助手",
    difficulty: "⭐⭐⭐",
    tech: ["Agent", "Code Interpreter", "GPT-4"],
    description: "自动编程助手，能理解和生成代码"
  },
  {
    title: "研报生成器",
    difficulty: "⭐⭐⭐",
    tech: ["Multi-Agent", "CrewAI", "Web Search"],
    description: "自动收集数据并生成研究报告"
  },
  {
    title: "个人知识库",
    difficulty: "⭐⭐",
    tech: ["RAG", "Embedding", "Chroma"],
    description: "管理个人笔记，支持语义搜索"
  },
  {
    title: "模型微调",
    difficulty: "⭐⭐⭐⭐",
    tech: ["LoRA", "QLoRA", "PEFT"],
    description: "使用LoRA微调大模型适应特定任务"
  },
  {
    title: "多Agent协作",
    difficulty: "⭐⭐⭐⭐",
    tech: ["AutoGen", "CrewAI", "Tool Use"],
    description: "构建多个Agent协作完成复杂任务"
  }
];

// 上手代码示例
const codeExamples = [
  {
    title: "使用 Ollama 本地运行模型",
    language: "bash",
    code: `# 安装 Ollama
# macOS/Linux: curl -fsSL https://ollama.com/install.sh | sh

# 拉取模型
ollama pull llama3.2
ollama pull qwen2.5

# 运行模型
ollama run llama3.2

# API 调用
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2",
  "prompt": "解释什么是AI Agent"
}'`
  },
  {
    title: "LangChain 基础 Agent",
    language: "python",
    code: `from langchain.agents import initialize_agent, Tool
from langchain_openai import ChatOpenAI
from langchain.tools import DuckDuckGoSearchRun

# 定义工具
search = DuckDuckGoSearchRun()
tools = [
    Tool(name="Search", func=search.run, 
         description="搜索实时信息")
]

# 创建 Agent
llm = ChatOpenAI(model="gpt-4")
agent = initialize_agent(
    tools, llm, 
    agent="zero-shot-react-description",
    verbose=True
)

# 运行
result = agent.run("今天AI有什么重大新闻？")`
  },
  {
    title: "LoRA 微调模型",
    language: "python",
    code: `from transformers import AutoModelForCausalLM
from peft import LoraConfig, get_peft_model

# 加载基础模型
model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-2-7b-hf",
    torch_dtype="auto",
    device_map="auto"
)

# 配置 LoRA
lora_config = LoraConfig(
    r=16,                    # LoRA rank
    lora_alpha=32,           # 缩放参数
    target_modules=["q_proj", "v_proj"],
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM"
)

# 应用 LoRA
model = get_peft_model(model, lora_config)
model.print_trainable_parameters()

# 开始训练...`
  },
  {
    title: "RAG 检索增强",
    language: "python",
    code: `from langchain import OpenAI, VectorDBQA
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.document_loaders import TextLoader

# 加载文档
loader = TextLoader("docs.txt")
docs = loader.load()

# 创建向量数据库
embeddings = OpenAIEmbeddings()
vectordb = Chroma.from_documents(docs, embeddings)

# 创建 QA 链
qa = VectorDBQA.from_chain_type(
    llm=OpenAI(),
    chain_type="stuff",
    vectorstore=vectordb
)

# 查询
answer = qa.run("什么是我们的退货政策？")`
  }
];

// 学习路径
const learningPaths = [
  {
    title: "AI 应用开发者",
    duration: "4-6 周",
    steps: [
      "学习 Python 基础",
      "理解 LLM 原理和 API 使用",
      "掌握 LangChain/LlamaIndex",
      "开发 RAG 应用",
      "构建第一个 Agent"
    ]
  },
  {
    title: "模型定制工程师",
    duration: "6-8 周",
    steps: [
      "学习深度学习和 Transformer",
      "掌握 PyTorch/TensorFlow",
      "学习 LoRA/QLoRA 微调",
      "模型量化与部署",
      "构建专属模型"
    ]
  },
  {
    title: "AI Agent 专家",
    duration: "8-10 周",
    steps: [
      "深入理解 Agent 架构",
      "掌握 ReAct/Plan-and-Solve",
      "开发复杂工具链",
      "多 Agent 协作系统",
      "自主任务规划"
    ]
  }
];

export default function LearnPage() {
  const [selectedCode, setSelectedCode] = useState(0);

  const getLevelColor = (level: string) => {
    switch (level) {
      case "入门": return "bg-green-100 text-green-700";
      case "中级": return "bg-blue-100 text-blue-700";
      case "高级": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <GraduationCap className="w-10 h-10" />
                <span className="text-xl font-medium">NewClaw Learning Hub</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                AI 学习模块
              </h1>
              <p className="text-xl text-white/90 mb-8">
                从概念到实战，系统掌握 AI 核心技能
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" variant="secondary" className="gap-2">
                  <Play className="w-4 h-4" />
                  开始学习
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  查看实战项目
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="concepts" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="concepts" className="gap-2">
              <BookOpen className="w-4 h-4" /> 核心概念
            </TabsTrigger>
            <TabsTrigger value="courses" className="gap-2">
              <Lightbulb className="w-4 h-4" /> 学习资源
            </TabsTrigger>
            <TabsTrigger value="code" className="gap-2">
              <Code className="w-4 h-4" /> 上手代码
            </TabsTrigger>
            <TabsTrigger value="projects" className="gap-2">
              <Target className="w-4 h-4" /> 实战项目
            </TabsTrigger>
          </TabsList>

          {/* 核心概念 */}
          <TabsContent value="concepts">
            <div className="grid md:grid-cols-3 gap-6">
              {concepts.map((cat, idx) => (
                <Card key={idx} className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <cat.icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <CardTitle className="text-lg">{cat.category}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {cat.items.map((item, i) => (
                        <div key={i} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">{item.name}</span>
                            <Badge className={getLevelColor(item.level)} variant="secondary">
                              {item.level}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 学习路径 */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Brain className="w-6 h-6 text-purple-600" />
                推荐学习路径
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {learningPaths.map((path, idx) => (
                  <Card key={idx} className="border-l-4 border-l-purple-500">
                    <CardHeader>
                      <CardTitle className="text-lg">{path.title}</CardTitle>
                      <p className="text-sm text-gray-500">预计时间: {path.duration}</p>
                    </CardHeader>
                    <CardContent>
                      <ol className="space-y-2">
                        {path.steps.map((step, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs flex-shrink-0">
                              {i + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* 学习资源 */}
          <TabsContent value="courses">
            <div className="grid md:grid-cols-2 gap-4">
              {courses.map((course, idx) => (
                <Card key={idx} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{course.title}</h3>
                          <Badge className={getLevelColor(course.level)}>
                            {course.level}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{course.description}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span className="font-medium">{course.platform}</span>
                        </div>
                      </div>
                      <a 
                        href={course.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 必读论文 */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">必读论文</h2>
              <div className="bg-white rounded-lg border p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { name: "Attention Is All You Need", year: "2017", desc: "Transformer架构" },
                    { name: "GPT-3", year: "2020", desc: "大模型里程碑" },
                    { name: "InstructGPT", year: "2022", desc: "RLHF训练" },
                    { name: "LLaMA", year: "2023", desc: "开源大模型" },
                    { name: "ReAct", year: "2023", desc: "Agent架构" },
                    { name: "RAG", year: "2020", desc: "检索增强生成" },
                  ].map((paper, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded flex items-center justify-center text-sm font-bold">
                        {paper.year.slice(-2)}
                      </div>
                      <div>
                        <div className="font-medium">{paper.name}</div>
                        <div className="text-sm text-gray-500">{paper.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* 上手代码 */}
          <TabsContent value="code">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-2">
                {codeExamples.map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedCode(idx)}
                    className={`w-full text-left p-4 rounded-lg transition-colors ${
                      selectedCode === idx 
                        ? "bg-blue-50 border-blue-200 border" 
                        : "bg-white border hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{example.title}</span>
                      <ChevronRight className={`w-4 h-4 transition-transform ${
                        selectedCode === idx ? "rotate-90" : ""
                      }`} />
                    </div>
                    <Badge variant="secondary" className="mt-2">
                      {example.language}
                    </Badge>
                  </button>
                ))}
              </div>
              <div className="lg:col-span-2">
                <Card className="bg-gray-900 text-gray-100">
                  <CardHeader className="border-b border-gray-800">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">
                        {codeExamples[selectedCode].title}
                      </span>
                      <Badge variant="secondary" className="bg-gray-800">
                        {codeExamples[selectedCode].language}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <pre className="p-4 overflow-x-auto text-sm">
                      <code>{codeExamples[selectedCode].code}</code>
                    </pre>
                  </CardContent>
                </Card>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-blue-600" />
                    提示
                  </h4>
                  <p className="text-sm text-gray-600">
                    复制代码到本地运行前，请确保已安装必要的依赖包。
                    建议先创建虚拟环境，避免依赖冲突。
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* 实战项目 */}
          <TabsContent value="projects">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, idx) => (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{project.difficulty}</Badge>
                      <Bot className="w-5 h-5 text-gray-400" />
                    </div>
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((t, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 快速开始 */}
            <div className="mt-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">准备好开始了吗？</h2>
                  <p className="text-white/90">
                    选择一个项目，跟着教程一步步实现你的第一个 AI 应用
                  </p>
                </div>
                <Button size="lg" variant="secondary" className="gap-2">
                  <Code className="w-4 h-4" />
                  查看完整教程
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}