"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  Code, 
  Brain, 
  Cpu, 
  Bot, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Play,
  GraduationCap,
  Target,
  Clock,
  Star,
  FileText,
  Wrench,
  Rocket,
  Circle,
  Terminal,
  Lightbulb,
  MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// 简化的学习路径数据
const agentPath = {
  id: "agent",
  title: "小白学 Agent",
  subtitle: "从零开始，7天掌握 AI Agent 开发",
  description: "不需要深度学习背景，跟着动手做，快速上手 AI Agent 开发",
  icon: Bot,
  color: "purple",
  totalHours: 20,
  levels: [
    {
      day: "第1-2天",
      title: "Agent 基础概念",
      hours: 4,
      topics: [
        { title: "什么是 AI Agent", desc: "理解 Agent 的本质：感知-思考-行动循环" },
        { title: "LLM 基础", desc: "了解大语言模型如何作为 Agent 的大脑" },
        { title: "工具调用", desc: "学习如何让 Agent 使用外部工具" },
        { title: "动手实验", desc: "使用 Ollama 本地运行第一个模型" },
      ],
      project: "本地运行 Llama3.2",
      code: `# 安装 Ollama
curl -fsSL https://ollama.com/install.sh | sh

# 拉取并运行模型
ollama pull llama3.2
ollama run llama3.2`
    },
    {
      day: "第3-4天",
      title: "LangChain 实战",
      hours: 6,
      topics: [
        { title: "LangChain 核心概念", desc: "Chain、Prompt、Model、Output Parser" },
        { title: "构建第一个 Agent", desc: "使用 LangChain 创建简单 Agent" },
        { title: "添加工具", desc: "集成搜索、计算器等工具" },
        { title: "记忆系统", desc: "让 Agent 记住对话历史" },
      ],
      project: "智能助手",
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
        { title: "Embedding 原理", desc: "文本如何变成向量" },
        { title: "向量数据库", desc: "使用 Chroma 存储和检索" },
        { title: "文档处理", desc: "加载、切分、索引文档" },
        { title: "构建知识库", desc: "让 Agent 基于私有数据回答" },
      ],
      project: "智能问答系统",
      code: `from langchain import VectorDBQA
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma

embeddings = OpenAIEmbeddings()
vectordb = Chroma.from_documents(docs, embeddings)

qa = VectorDBQA.from_chain_type(llm=OpenAI(), vectorstore=vectordb)`
    },
    {
      day: "第7天",
      title: "Multi-Agent 系统",
      hours: 4,
      topics: [
        { title: "多 Agent 架构", desc: "理解多 Agent 协作模式" },
        { title: "CrewAI 框架", desc: "快速构建 Agent 团队" },
        { title: "任务分配", desc: "让不同 Agent 负责不同任务" },
        { title: "项目实战", desc: "构建研报生成团队" },
      ],
      project: "研报生成器",
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
  description: "掌握模型微调、量化、部署，打造属于你的 AI 模型",
  icon: Cpu,
  color: "blue",
  totalHours: 30,
  levels: [
    {
      day: "阶段一",
      title: "本地部署大模型",
      hours: 4,
      topics: [
        { title: "Ollama 入门", desc: "最简单的方式本地运行模型" },
        { title: "vLLM 部署", desc: "高性能模型服务" },
        { title: "模型量化", desc: "GGUF 格式和量化级别" },
        { title: "API 封装", desc: "提供 OpenAI 兼容接口" },
      ],
      project: "本地部署 Qwen2.5",
      code: `python -m vllm.entrypoints.openai.api_server \\
  --model "Qwen/Qwen2.5-7B-Instruct" \\
  --tensor-parallel-size 1`
    },
    {
      day: "阶段二",
      title: "LoRA 高效微调",
      hours: 10,
      topics: [
        { title: "微调原理", desc: "理解 LoRA 和全参数微调的区别" },
        { title: "数据准备", desc: "构建高质量的微调数据集" },
        { title: "LoRA 配置", desc: "rank、alpha、target_modules" },
        { title: "QLoRA 实践", desc: "在消费级 GPU 上微调大模型" },
      ],
      project: "领域专用模型",
      code: `from transformers import AutoModelForCausalLM
from peft import LoraConfig, get_peft_model

model = AutoModelForCausalLM.from_pretrained("Qwen/Qwen2.5-7B")

lora_config = LoraConfig(r=16, lora_alpha=32)
model = get_peft_model(model, lora_config)`
    },
    {
      day: "阶段三",
      title: "模型优化与导出",
      hours: 8,
      topics: [
        { title: "模型合并", desc: "将 LoRA 权重合并到基础模型" },
        { title: "量化导出", desc: "GPTQ、AWQ、GGUF 格式转换" },
        { title: "推理优化", desc: "使用 vLLM、TensorRT 加速" },
        { title: "模型评估", desc: "测试微调效果" },
      ],
      project: "模型部署",
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
        { title: "多模态微调", desc: "视觉-语言模型定制" },
        { title: "RLHF 训练", desc: "基于人类反馈的强化学习" },
        { title: "DPO 训练", desc: "直接偏好优化" },
        { title: "模型融合", desc: "MergeKit 模型合并" },
      ],
      project: "DPO 优化",
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
    { name: "机器学习", desc: "监督/无监督/强化学习" },
    { name: "深度学习", desc: "神经网络、CNN、RNN、Transformer" },
    { name: "大语言模型", desc: "GPT、Claude、Llama 架构原理" },
    { name: "生成式 AI", desc: "文本/图像/音频/视频生成" },
    { name: "RAG", desc: "检索增强生成、向量数据库" },
    { name: "AI Agent", desc: "ReAct、工具使用、多 Agent 协作" },
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

  const currentPath = activeTab === "agent" ? agentPath : activeTab === "model" ? modelPath : null;

  return (
    <div className="min-h-screen bg-gray-50">
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
              onClick={() => { setActiveTab("agent"); setExpandedLevel(0); }}
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Bot className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">小白学 Agent</h3>
                <p className="text-gray-600 text-sm mb-4">从零开始，7天掌握 AI Agent 开发</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>20 小时 · 4 个阶段</span>
                </div>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer transition-all hover:shadow-lg ${activeTab === "model" ? "ring-2 ring-blue-500" : ""}`}
              onClick={() => { setActiveTab("model"); setExpandedLevel(0); }}
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Cpu className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">AI 模型定制化</h3>
                <p className="text-gray-600 text-sm mb-4">从使用模型到拥有专属模型</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>30 小时 · 4 个阶段</span>
                </div>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer transition-all hover:shadow-lg ${activeTab === "knowledge" ? "ring-2 ring-green-500" : ""}`}
              onClick={() => setActiveTab("knowledge")}
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">AI 学习大全</h3>
                <p className="text-gray-600 text-sm mb-4">概念知识点 + 权威资源 + 实战教程</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
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
                <h2 className="text-3xl font-bold mb-2">{currentPath.title}</h2>
                <p className="text-xl text-gray-600">{currentPath.subtitle}</p>
              </div>

              <div className="space-y-4">
                {currentPath.levels.map((level, idx) => (
                  <Card key={idx} className={`overflow-hidden ${expandedLevel === idx ? "ring-2 ring-purple-500" : ""}`}>
                    <CardHeader className="cursor-pointer hover:bg-gray-50" onClick={() => setExpandedLevel(expandedLevel === idx ? null : idx)}>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <span className="text-lg font-bold text-purple-600">{idx + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary">{level.day}</Badge>
                            <span className="text-sm text-gray-500">{level.hours} 小时</span>
                          </div>
                          <CardTitle className="text-lg">{level.title}</CardTitle>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedLevel === idx ? "rotate-180" : ""}`} />
                      </div>
                    </CardHeader>
                    
                    {expandedLevel === idx && (
                      <CardContent className="border-t bg-gray-50/50">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium mb-3">学习内容</h4>
                            <div className="space-y-2">
                              {level.topics.map((topic: any, i: number) => (
                                <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-lg">
                                  <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-xs">{i+1}</span>
                                  </div>
                                  <div>
                                    <div className="font-medium text-sm">{topic.title}</div>
                                    <div className="text-xs text-gray-500">{topic.desc}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <div className="text-sm font-medium text-yellow-800">🎯 {level.project}</div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-3">核心代码</h4>
                            <div className="bg-gray-900 rounded-lg overflow-hidden">
                              <div className="px-4 py-2 bg-gray-800">
                                <span className="text-xs text-gray-400">示例代码</span>
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
            // AI 学习大全
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">{knowledgeBase.title}</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5" /> 核心概念
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {knowledgeBase.concepts.map((item: any, idx: number) => (
                        <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                          <div className="font-medium text-sm">{item.name}</div>
                          <div className="text-xs text-gray-500">{item.desc}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" /> 必读论文
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {knowledgeBase.papers.map((paper: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 bg-green-100 text-green-600 rounded flex items-center justify-center text-sm font-bold">
                            {paper.year.slice(-2)}
                          </div>
                          <div>
                            <div className="font-medium text-sm">{paper.name}</div>
                            <div className="text-xs text-gray-500">{paper.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wrench className="w-5 h-5" /> 开发工具
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {knowledgeBase.tools.map((tool: any, idx: number) => (
                        <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                          <div className="font-medium text-sm">{tool.name}</div>
                          <div className="text-xs text-gray-500">{tool.desc}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Rocket className="w-5 h-5" /> 实战项目
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {knowledgeBase.projects.map((project: any, idx: number) => (
                        <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">{project.name}</span>
                            <Badge variant="outline" className="text-xs">{project.difficulty}</Badge>
                          </div>
                          <div className="text-xs text-gray-500">{project.tech}</div>
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
