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
  Play,
  GraduationCap,
  Target,
  Zap,
  Layers,
  Database,
  Search,
  MessageSquare,
  Wrench,
  Users,
  ArrowRight,
  CheckCircle2,
  Clock,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

// ==================== 主流程一：小白学 Agent ====================

const agentLearningPath = {
  title: "小白学 Agent",
  subtitle: "从零开始，7天掌握 AI Agent 开发",
  description: "不需要深度学习背景，跟着动手做，快速上手 AI Agent 开发",
  totalHours: 20,
  levels: [
    {
      level: "第1-2天",
      title: "Agent 基础概念",
      hours: 4,
      icon: BookOpen,
      content: [
        { title: "什么是 AI Agent", desc: "理解 Agent 的本质：感知-思考-行动循环", done: false },
        { title: "LLM 基础", desc: "了解大语言模型如何作为 Agent 的大脑", done: false },
        { title: "工具调用 (Tool Use)", desc: "学习如何让 Agent 使用外部工具", done: false },
        { title: "动手实验", desc: "使用 Ollama 本地运行第一个模型", done: false },
      ],
      project: "🎯 完成：本地运行 Llama3.2 并对话",
      codeExample: `# 安装 Ollama
# curl -fsSL https://ollama.com/install.sh | sh

# 拉取模型
ollama pull llama3.2

# 运行
ollama run llama3.2

# API 调用
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2",
  "prompt": "你好，请介绍一下自己"
}'`
    },
    {
      level: "第3-4天",
      title: "LangChain 实战",
      hours: 6,
      icon: Layers,
      content: [
        { title: "LangChain 核心概念", desc: "Chain、Prompt、Model、Output Parser", done: false },
        { title: "构建第一个 Agent", desc: "使用 LangChain 创建简单 Agent", done: false },
        { title: "添加工具", desc: "集成搜索、计算器等工具", done: false },
        { title: "记忆系统", desc: "让 Agent 记住对话历史", done: false },
      ],
      project: "🎯 完成：会搜索和计算的智能助手",
      codeExample: `from langchain.agents import initialize_agent, Tool
from langchain.tools import DuckDuckGoSearchRun
from langchain_openai import ChatOpenAI

# 创建工具
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
result = agent.run("今天北京的天气怎么样？")`
    },
    {
      level: "第5-6天",
      title: "RAG 知识增强",
      hours: 6,
      icon: Database,
      content: [
        { title: "Embedding 原理", desc: "文本如何变成向量", done: false },
        { title: "向量数据库", desc: "使用 Chroma 存储和检索", done: false },
        { title: "文档处理", desc: "加载、切分、索引文档", done: false },
        { title: "构建知识库", desc: "让 Agent 基于私有数据回答", done: false },
      ],
      project: "🎯 完成：基于私有文档的智能问答系统",
      codeExample: `from langchain import OpenAI, VectorDBQA
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.document_loaders import TextLoader

# 加载文档
loader = TextLoader("my_docs.txt")
docs = loader.load()

# 创建向量库
embeddings = OpenAIEmbeddings()
vectordb = Chroma.from_documents(docs, embeddings)

# 创建 QA 系统
qa = VectorDBQA.from_chain_type(
    llm=OpenAI(),
    chain_type="stuff",
    vectorstore=vectordb
)

# 提问
answer = qa.run("公司的年假政策是什么？")`
    },
    {
      level: "第7天",
      title: "Multi-Agent 系统",
      hours: 4,
      icon: Users,
      content: [
        { title: "多 Agent 架构", desc: "理解多 Agent 协作模式", done: false },
        { title: "CrewAI 框架", desc: "快速构建 Agent 团队", done: false },
        { title: "任务分配", desc: "让不同 Agent 负责不同任务", done: false },
        { title: "项目实战", desc: "构建研报生成团队", done: false },
      ],
      project: "🎯 完成：多 Agent 协作的研报生成器",
      codeExample: `from crewai import Agent, Task, Crew

# 定义 Agent
researcher = Agent(
    role="研究员",
    goal="收集AI领域最新资讯",
    backstory="资深AI研究员",
    verbose=True
)

writer = Agent(
    role="作家",
    goal="撰写技术文章",
    backstory="技术写作专家",
    verbose=True
)

# 定义任务和团队
crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, write_task],
    process=Process.sequential
)

# 执行
result = crew.kickoff()`
    }
  ]
};

// ==================== 主流程二：AI 模型定制化 ====================

const modelCustomizationPath = {
  title: "AI 模型定制化",
  subtitle: "从使用模型到拥有专属模型",
  description: "掌握模型微调、量化、部署，打造属于你的 AI 模型",
  totalHours: 30,
  levels: [
    {
      level: "阶段一",
      title: "本地部署大模型",
      hours: 4,
      icon: Cpu,
      content: [
        { title: "Ollama 入门", desc: "最简单的方式本地运行模型", done: false },
        { title: "vLLM 部署", desc: "高性能模型服务", done: false },
        { title: "模型量化", desc: "GGUF 格式和量化级别", done: false },
        { title: "API 封装", desc: "提供 OpenAI 兼容接口", done: false },
      ],
      project: "🎯 完成：本地部署 Qwen2.5-7B 并提供 API 服务",
      codeExample: `# 使用 vLLM 部署
pip install vllm

# 启动服务
python -m vllm.entrypoints.openai.api_server \\
  --model "Qwen/Qwen2.5-7B-Instruct" \\
  --tensor-parallel-size 1 \\
  --max-model-len 8192

# API 调用
curl http://localhost:8000/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "Qwen/Qwen2.5-7B-Instruct",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`
    },
    {
      level: "阶段二",
      title: "LoRA 高效微调",
      hours: 10,
      icon: Target,
      content: [
        { title: "微调原理", desc: "理解 LoRA 和全参数微调的区别", done: false },
        { title: "数据准备", desc: "构建高质量的微调数据集", done: false },
        { title: "LoRA 配置", desc: "rank、alpha、target_modules", done: false },
        { title: "QLoRA 实践", desc: "在消费级 GPU 上微调大模型", done: false },
      ],
      project: "🎯 完成：使用 LoRA 微调一个领域专用模型",
      codeExample: `from transformers import AutoModelForCausalLM
from peft import LoraConfig, get_peft_model
from trl import SFTTrainer

# 加载基础模型
model = AutoModelForCausalLM.from_pretrained(
    "Qwen/Qwen2.5-7B",
    torch_dtype="auto",
    device_map="auto"
)

# 配置 LoRA
lora_config = LoraConfig(
    r=16,              # LoRA rank
    lora_alpha=32,     # 缩放参数
    target_modules=["q_proj", "v_proj", "k_proj", "o_proj"],
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM"
)

# 应用 LoRA
model = get_peft_model(model, lora_config)

# 查看可训练参数
model.print_trainable_parameters()
# 输出: trainable params: 20M || all params: 7B || trainable%: 0.28

# 开始训练
trainer = SFTTrainer(
    model=model,
    train_dataset=dataset,
    max_seq_length=512,
    args=TrainingArguments(
        output_dir="./lora_output",
        num_train_epochs=3,
        per_device_train_batch_size=4,
        learning_rate=2e-4,
    )
)
trainer.train()`
    },
    {
      level: "阶段三",
      title: "模型优化与导出",
      hours: 8,
      icon: Zap,
      content: [
        { title: "模型合并", desc: "将 LoRA 权重合并到基础模型", done: false },
        { title: "量化导出", desc: "GPTQ、AWQ、GGUF 格式转换", done: false },
        { title: "推理优化", desc: "使用 vLLM、TensorRT 加速", done: false },
        { title: "模型评估", desc: "测试微调效果", done: false },
      ],
      project: "🎯 完成：导出优化后的模型并部署",
      codeExample: `# 合并 LoRA 权重
from peft import PeftModel

# 加载基础模型和 LoRA
model = AutoModelForCausalLM.from_pretrained("base_model")
model = PeftModel.from_pretrained(model, "lora_adapter")

# 合并权重
merged_model = model.merge_and_unload()

# 保存完整模型
merged_model.save_pretrained("./merged_model")

# 转换为 GGUF (使用 llama.cpp)
python convert_hf_to_gguf.py ./merged_model \\
  --outfile model.gguf \\
  --outtype q4_k_m`
    },
    {
      level: "阶段四",
      title: "高级定制技术",
      hours: 8,
      icon: Sparkles,
      content: [
        { title: "多模态微调", desc: "视觉-语言模型定制", done: false },
        { title: "RLHF 训练", desc: "基于人类反馈的强化学习", done: false },
        { title: "DPO 训练", desc: "直接偏好优化", done: false },
        { title: "模型融合", desc: "MergeKit 模型合并", done: false },
      ],
      project: "🎯 完成：使用 DPO 优化模型输出质量",
      codeExample: `# DPO 训练示例
from trl import DPOTrainer
from peft import LoraConfig

dpo_config = {
    "beta": 0.1,  # DPO 温度参数
    "loss_type": "sigmoid"
}

trainer = DPOTrainer(
    model=model,
    ref_model=ref_model,  # 参考模型
    args=training_args,
    train_dataset=dpo_dataset,  # 包含 chosen/rejected 的数据
    tokenizer=tokenizer,
    peft_config=lora_config,
)

trainer.train()`
    }
  ]
};

// 推荐工具
const recommendedTools = [
  { name: "Ollama", desc: "本地运行大模型最简单方式", category: "部署", link: "https://ollama.com" },
  { name: "LangChain", desc: "LLM 应用开发框架", category: "开发", link: "https://langchain.com" },
  { name: "Hugging Face", desc: "模型和数据集仓库", category: "资源", link: "https://huggingface.co" },
  { name: "Unsloth", desc: "2倍速微调，显存减少70%", category: "微调", link: "https://unsloth.ai" },
  { name: "LLaMA-Factory", desc: "一站式模型微调框架", category: "微调", link: "https://github.com/hiyouga/LLaMA-Factory" },
  { name: "vLLM", desc: "高吞吐大模型推理引擎", category: "部署", link: "https://vllm.ai" },
];

// 常见问题
const faqs = [
  {
    q: "没有深度学习基础，能学 Agent 开发吗？",
    a: "完全可以！Agent 开发更侧重于工程能力，你只需要会调用 API 和使用框架。本教程从最简单的 Ollama 开始，不需要理解 Transformer 原理。"
  },
  {
    q: "微调模型需要什么硬件？",
    a: "7B 模型用 LoRA 微调，16GB 显存即可（如 RTX 4060 Ti）。使用 QLoRA 甚至 8GB 显存也能微调。也可以租用云 GPU（如 AutoDL、Vast.ai）。"
  },
  {
    q: "Agent 和 RAG 有什么区别？",
    a: "RAG 是 Agent 的一种能力。Agent 是能自主决策的系统，RAG 是其中一种工具（检索工具）。Agent 可以调用 RAG、搜索引擎、代码执行等多种工具。"
  },
  {
    q: "微调后的模型可以商用吗？",
    a: "取决于基础模型的许可证。Llama 3、Qwen 2.5 允许商用，但需遵守相应协议。自己微调后的模型通常可以商用。"
  },
];

export default function LearnPage() {
  const [activeTab, setActiveTab] = useState("agent");
  const [expandedLevel, setExpandedLevel] = useState<number | null>(0);
  const [progress, setProgress] = useState(0);

  const currentPath = activeTab === "agent" ? agentLearningPath : modelCustomizationPath;

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
                AI 实战学习
              </h1>
              <p className="text-xl text-white/90 mb-8">
                两大核心路径：小白学 Agent + AI 模型定制化
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  size="lg" 
                  variant={activeTab === "agent" ? "default" : "secondary"}
                  className="gap-2 bg-white text-purple-600 hover:bg-gray-100"
                  onClick={() => setActiveTab("agent")}
                >
                  <Bot className="w-4 h-4" />
                  小白学 Agent
                </Button>
                <Button 
                  size="lg" 
                  variant={activeTab === "model" ? "default" : "secondary"}
                  className="gap-2 bg-white text-blue-600 hover:bg-gray-100"
                  onClick={() => setActiveTab("model")}
                >
                  <Cpu className="w-4 h-4" />
                  模型定制化
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Path Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              {activeTab === "agent" ? <Bot className="w-8 h-8 text-purple-600" /> : <Cpu className="w-8 h-8 text-blue-600" />}
              <h1 className="text-3xl font-bold">{currentPath.title}</h1>
            </div>
            <p className="text-xl text-gray-600 mb-2">{currentPath.subtitle}</p>
            <p className="text-gray-500">{currentPath.description}</p>
            <div className="flex items-center gap-4 mt-4">
              <Badge variant="secondary" className="gap-1">
                <Clock className="w-3 h-3" />
                预计 {currentPath.totalHours} 小时
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <Layers className="w-3 h-3" />
                {currentPath.levels.length} 个阶段
              </Badge>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-8 p-4 bg-white rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">学习进度</span>
              <span className="text-sm text-gray-500">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Learning Levels */}
          <div className="space-y-4">
            {currentPath.levels.map((level, idx) => (
              <Card 
                key={idx} 
                className={`overflow-hidden transition-all ${
                  expandedLevel === idx ? "ring-2 ring-purple-500" : ""
                }`}
              >
                <CardHeader 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpandedLevel(expandedLevel === idx ? null : idx)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        activeTab === "agent" ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"
                      }`}>
                        <level.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{level.level}</Badge>
                          <span className="text-sm text-gray-500">{level.hours} 小时</span>
                        </div>
                        <CardTitle className="text-lg mt-1">{level.title}</CardTitle>
                      </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedLevel === idx ? "rotate-90" : ""
                    }`} />
                  </div>
                </CardHeader>
                
                {expandedLevel === idx && (
                  <CardContent className="border-t bg-gray-50/50"
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* 学习内容 */}
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <BookOpen className="w-4 h-4" /> 学习内容
                        </h4>
                        <div className="space-y-2">
                          {level.content.map((item, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-lg"
                            >
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                item.done ? "bg-green-500 text-white" : "bg-gray-200"
                              }`}>
                                {item.done ? <CheckCircle2 className="w-3 h-3" /> : <span className="text-xs">{i+1}</span>}
                              </div>
                              <div>
                                <div className="font-medium text-sm">{item.title}</div>
                                <div className="text-xs text-gray-500">{item.desc}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-center gap-2 text-sm">
                            <Target className="w-4 h-4 text-yellow-600" />
                            <span className="font-medium text-yellow-800">{level.project}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* 代码示例 */}
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Code className="w-4 h-4" /> 核心代码
                        </h4>
                        <div className="bg-gray-900 rounded-lg overflow-hidden">
                          <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
                            <span className="text-xs text-gray-400">示例代码</span>
                            <Button size="sm" variant="ghost" className="h-6 text-xs">
                              复制
                            </Button>
                          </div>
                          <pre className="p-4 overflow-x-auto text-sm text-gray-100">
                            <code>{level.codeExample}</code>
                          </pre>
                        </div>
                        <Button 
                          className="w-full mt-3 gap-2" 
                          variant="outline"
                        >
                          <Play className="w-4 h-4" />
                          开始实践
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {/* Tools Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Wrench className="w-6 h-6" />
              推荐工具
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {recommendedTools.map((tool, idx) => (
                <a
                  key={idx}
                  href={tool.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Card className="hover:shadow-md transition-shadow h-full"
                  >
                    <CardContent className="p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{tool.name}</span>
                            <Badge variant="secondary" className="text-xs">{tool.category}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{tool.desc}</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MessageSquare className="w-6 h-6" />
              常见问题
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <Card key={idx}>
                  <CardContent className="p-5">
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm">Q</span>
                      {faq.q}
                    </h3>
                    <p className="text-gray-600 text-sm pl-8">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white text-center"
          >
            <h2 className="text-2xl font-bold mb-4">准备好开始了吗？</h2>
            <p className="text-white/90 mb-6">
              选择一条路径，跟着教程动手实践，7-14天掌握 AI 开发技能
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                variant="secondary"
                className="gap-2"
                onClick={() => { setActiveTab("agent"); setExpandedLevel(0); }}
              >
                <Bot className="w-4 h-4" />
                从 Agent 开始
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                onClick={() => { setActiveTab("model"); setExpandedLevel(0); }}
              >
                <Cpu className="w-4 h-4" />
                模型定制化
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}