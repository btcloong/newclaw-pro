# AI 学习模块 - 从概念到实战

> NewClaw 出品的 AI 学习路线图，帮助你系统掌握 AI 核心概念与实战技能

---

## 📚 第一部分：AI 核心概念与知识点

### 一、基础概念

#### 1. 机器学习 (Machine Learning)
| 概念 | 说明 | 学习资源 |
|------|------|----------|
| **监督学习** | 使用标注数据训练模型 | [Google ML Crash Course](https://developers.google.com/machine-learning/crash-course) |
| **无监督学习** | 从无标注数据中发现模式 | [Stanford CS229](https://cs229.stanford.edu/) |
| **强化学习** | 通过奖励机制学习决策 | [Spinning Up in RL](https://spinningup.openai.com/) |
| **迁移学习** | 将已学知识应用到新任务 | [Hugging Face Course](https://huggingface.co/course) |

#### 2. 深度学习 (Deep Learning)
| 概念 | 说明 | 关键知识点 |
|------|------|------------|
| **神经网络** | 模拟人脑的神经元连接 | 前向传播、反向传播、梯度下降 |
| **CNN** | 卷积神经网络，擅长图像处理 | 卷积层、池化层、特征提取 |
| **RNN/LSTM** | 循环神经网络，处理序列数据 | 时序建模、长短期记忆 |
| **Transformer** | 注意力机制架构，NLP主流 | Self-Attention、多头注意力 |

#### 3. 大语言模型 (LLM)
| 概念 | 说明 | 代表模型 |
|------|------|----------|
| **GPT架构** | 生成式预训练Transformer | GPT-4, GPT-4.5, Claude, Llama |
| **Tokenization** | 文本分词处理 | BPE, WordPiece, SentencePiece |
| **上下文窗口** | 模型能处理的文本长度 | 4K, 32K, 128K, 2M tokens |
| **涌现能力** | 规模达到一定程度后出现的新能力 | 推理、代码生成、多模态 |

#### 4. 生成式 AI (Generative AI)
| 概念 | 说明 | 应用场景 |
|------|------|----------|
| **文本生成** | 生成自然语言文本 | 写作助手、代码生成 |
| **图像生成** | 从文本/图像生成图像 | Midjourney, DALL-E, Stable Diffusion |
| **音频生成** | 语音合成、音乐生成 | ElevenLabs, Suno |
| **视频生成** | 文本/图像生成视频 | Sora, Runway, Pika |
| **多模态** | 处理多种类型数据 | GPT-4V, Gemini, Claude 3 |

---

### 二、进阶概念

#### 5. 模型优化与部署
| 概念 | 说明 | 工具/框架 |
|------|------|-----------|
| **量化 (Quantization)** | 降低模型精度以减少大小 | GPTQ, AWQ, GGUF |
| **蒸馏 (Distillation)** | 大模型知识迁移到小模型 | 教师-学生模型 |
| **剪枝 (Pruning)** | 移除不重要的权重 | 结构化/非结构化剪枝 |
| **LoRA/QLoRA** | 低秩适配，高效微调 | PEFT库 |
| **推理优化** | 加速模型推理 | vLLM, TensorRT, ONNX |

#### 6. AI Agent 核心概念
| 概念 | 说明 | 关键技术 |
|------|------|----------|
| **Agent架构** | 感知-决策-执行循环 | ReAct, Plan-and-Solve |
| **工具使用 (Tool Use)** | 调用外部API和工具 | Function Calling |
| **记忆系统** | 短期/长期记忆管理 | Vector DB, RAG |
| **多Agent协作** | 多个Agent协同工作 | AutoGen, CrewAI |
| **自主规划** | 分解任务并执行 | Chain-of-Thought, Tree-of-Thoughts |

#### 7. RAG (检索增强生成)
| 概念 | 说明 | 组件 |
|------|------|------|
| **Embedding** | 文本向量化表示 | OpenAI, BGE, M3E |
| **向量数据库** | 存储和检索向量 | Pinecone, Milvus, Chroma |
| **分块策略** | 文档切分方法 | 固定长度、语义分块 |
| **重排序** | 优化检索结果 | Cross-encoder |

---

### 三、权威学习资源

#### 🎓 在线课程
| 课程 | 平台 | 难度 | 链接 |
|------|------|------|------|
| **机器学习** | 吴恩达 | 入门 | [Coursera](https://www.coursera.org/learn/machine-learning) |
| **深度学习专项** | 吴恩达 | 中级 | [Coursera](https://www.coursera.org/specializations/deep-learning) |
| **Fast.ai** | fast.ai | 实战 | [fast.ai](https://www.fast.ai/) |
| **Hugging Face NLP** | HF | 中级 | [Course](https://huggingface.co/course) |
| **CS224N** | Stanford | 高级 | [NLP with DL](https://web.stanford.edu/class/cs224n/) |
| **CS231n** | Stanford | 高级 | [CNN for CV](https://cs231n.github.io/) |

#### 📖 必读论文
| 论文 | 年份 | 重要性 | 链接 |
|------|------|--------|------|
| **Attention Is All You Need** | 2017 | ⭐⭐⭐ Transformer架构 | [arXiv](https://arxiv.org/abs/1706.03762) |
| **GPT-3** | 2020 | ⭐⭐⭐ 大模型里程碑 | [arXiv](https://arxiv.org/abs/2005.14165) |
| **InstructGPT** | 2022 | ⭐⭐⭐ RLHF训练 | [arXiv](https://arxiv.org/abs/2203.02155) |
| **LLaMA** | 2023 | ⭐⭐⭐ 开源大模型 | [arXiv](https://arxiv.org/abs/2302.13971) |
| **RAG** | 2020 | ⭐⭐ 检索增强 | [arXiv](https://arxiv.org/abs/2005.11401) |
| **ReAct** | 2023 | ⭐⭐⭐ Agent架构 | [arXiv](https://arxiv.org/abs/2210.03629) |

#### 🛠️ 开发工具
| 工具 | 用途 | 链接 |
|------|------|------|
| **PyTorch** | 深度学习框架 | [pytorch.org](https://pytorch.org/) |
| **TensorFlow** | 深度学习框架 | [tensorflow.org](https://www.tensorflow.org/) |
| **Transformers** | 预训练模型库 | [Hugging Face](https://huggingface.co/docs/transformers) |
| **LangChain** | LLM应用开发 | [langchain.com](https://www.langchain.com/) |
| **LlamaIndex** | RAG开发框架 | [llamaindex.ai](https://www.llamaindex.ai/) |
| **Ollama** | 本地运行大模型 | [ollama.com](https://ollama.com/) |

---

## 🚀 第二部分：AI 模型定制化实战

### 一、模型微调 (Fine-tuning)

#### 方式对比
| 方式 | 适用场景 | 成本 | 效果 |
|------|----------|------|------|
| **全参数微调** | 大量数据、充足算力 | 高 | 最好 |
| **LoRA** | 消费级GPU、快速迭代 | 低 | 很好 |
| **QLoRA** | 显存受限、大模型微调 | 很低 | 好 |
| **Prompt Tuning** | 快速实验、少样本 | 极低 | 一般 |
| **Adapter** | 多任务、模块化 | 低 | 好 |

#### 实战：使用 LoRA 微调 Llama

```python
# 1. 安装依赖
# pip install transformers peft datasets accelerate

from transformers import (
    AutoModelForCausalLM, 
    AutoTokenizer,
    TrainingArguments,
    Trainer
)
from peft import LoraConfig, get_peft_model, TaskType
from datasets import load_dataset

# 2. 加载基础模型
model_name = "meta-llama/Llama-2-7b-hf"  # 或 "Qwen/Qwen2.5-7B"
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype="auto",
    device_map="auto"
)
tokenizer = AutoTokenizer.from_pretrained(model_name)

# 3. 配置 LoRA
lora_config = LoraConfig(
    task_type=TaskType.CAUSAL_LM,
    r=16,                    # LoRA rank
    lora_alpha=32,           # 缩放参数
    lora_dropout=0.05,
    target_modules=["q_proj", "v_proj", "k_proj", "o_proj"],
    bias="none"
)

# 4. 应用 LoRA
model = get_peft_model(model, lora_config)
model.print_trainable_parameters()  # 查看可训练参数量

# 5. 准备数据
dataset = load_dataset("json", data_files="your_data.jsonl")

def preprocess(examples):
    texts = [f"### 指令:\n{prompt}\n\n### 回复:\n{response}"
             for prompt, response in zip(examples["instruction"], examples["output"])]
    return tokenizer(texts, truncation=True, max_length=512, padding="max_length")

tokenized_dataset = dataset.map(preprocess, batched=True)

# 6. 训练
training_args = TrainingArguments(
    output_dir="./lora_output",
    num_train_epochs=3,
    per_device_train_batch_size=4,
    gradient_accumulation_steps=4,
    learning_rate=2e-4,
    fp16=True,
    logging_steps=10,
    save_strategy="epoch"
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_dataset["train"],
)

trainer.train()

# 7. 保存模型
model.save_pretrained("./lora_adapter")
```

#### 数据格式示例 (JSONL)
```json
{"instruction": "解释什么是机器学习", "input": "", "output": "机器学习是..."}
{"instruction": "将中文翻译成英文", "input": "你好世界", "output": "Hello World"}
```

---

### 二、本地部署大模型

#### 使用 Ollama (最简单)
```bash
# 1. 安装 Ollama
# macOS/Linux: curl -fsSL https://ollama.com/install.sh | sh

# 2. 拉取模型
ollama pull llama3.2
ollama pull qwen2.5
ollama pull deepseek-coder

# 3. 运行模型
ollama run llama3.2

# 4. API 调用
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2",
  "prompt": "解释什么是AI Agent"
}'
```

#### 使用 vLLM (高性能)
```bash
# 安装
pip install vllm

# 启动服务
python -m vllm.entrypoints.openai.api_server \
  --model "Qwen/Qwen2.5-7B-Instruct" \
  --tensor-parallel-size 1 \
  --max-model-len 8192

# API 调用 (OpenAI 兼容)
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Qwen/Qwen2.5-7B-Instruct",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

---

## 🤖 第三部分：AI Agent 开发实战

### 一、Agent 核心架构

```
┌─────────────────────────────────────────┐
│              User Input                 │
└─────────────────┬───────────────────────┘
                  ▼
┌─────────────────────────────────────────┐
│           LLM (大脑)                     │
│  - 理解意图                              │
│  - 规划任务                              │
│  - 生成行动                              │
└─────────────────┬───────────────────────┘
                  ▼
┌─────────────────────────────────────────┐
│         Tool Use (工具调用)              │
│  - 搜索引擎                              │
│  - 代码执行                              │
│  - API调用                               │
│  - 数据库查询                            │
└─────────────────┬───────────────────────┘
                  ▼
┌─────────────────────────────────────────┐
│         Memory (记忆系统)                │
│  - 短期记忆：当前对话                     │
│  - 长期记忆：向量数据库                   │
└─────────────────────────────────────────┘
```

### 二、使用 LangChain 开发 Agent

#### 1. 基础 Agent
```python
# pip install langchain langchain-openai

from langchain import OpenAI, LLMMathChain, SerpAPIWrapper
from langchain.agents import initialize_agent, Tool, AgentType
from langchain.memory import ConversationBufferMemory

# 定义工具
search = SerpAPIWrapper()
llm_math = LLMMathChain(llm=OpenAI())

tools = [
    Tool(
        name="Search",
        func=search.run,
        description="用于搜索实时信息"
    ),
    Tool(
        name="Calculator",
        func=llm_math.run,
        description="用于数学计算"
    )
]

# 初始化 Agent
memory = ConversationBufferMemory(memory_key="chat_history")
llm = OpenAI(temperature=0)

agent = initialize_agent(
    tools,
    llm,
    agent=AgentType.CONVERSATIONAL_REACT_DESCRIPTION,
    memory=memory,
    verbose=True
)

# 运行
response = agent.run("今天北京天气怎么样？然后计算25的平方")
```

#### 2. ReAct Agent (推理+行动)
```python
from langchain.agents import create_react_agent, AgentExecutor
from langchain import hub
from langchain.tools import Tool
from langchain_openai import ChatOpenAI

# 获取 ReAct prompt
prompt = hub.pull("hwchase17/react")

# 定义工具
def search_web(query: str) -> str:
    """搜索网络"""
    # 实现搜索逻辑
    return f"搜索结果: {query}"

def calculate(expression: str) -> str:
    """计算表达式"""
    return str(eval(expression))

tools = [
    Tool(name="Search", func=search_web, description="搜索网络信息"),
    Tool(name="Calculator", func=calculate, description="计算数学表达式")
]

# 创建 Agent
llm = ChatOpenAI(model="gpt-4", temperature=0)
agent = create_react_agent(llm, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

# 执行
result = agent_executor.invoke({
    "input": "2024年诺贝尔奖得主是谁？然后计算100除以5"
})
```

### 三、使用 AutoGen 开发多 Agent 系统

```python
# pip install pyautogen

import autogen

# 配置 LLM
config_list = [
    {
        "model": "gpt-4",
        "api_key": "your-api-key"
    }
]

# 创建 Agent
assistant = autogen.AssistantAgent(
    name="assistant",
    llm_config={"config_list": config_list}
)

user_proxy = autogen.UserProxyAgent(
    name="user_proxy",
    human_input_mode="NEVER",
    max_consecutive_auto_reply=10,
    code_execution_config={"work_dir": "coding"}
)

# 定义任务
task = """
创建一个 Python 脚本，实现以下功能：
1. 从 https://api.github.com/events 获取 GitHub 事件
2. 解析最近的 Push 事件
3. 保存到本地 JSON 文件
"""

# 启动对话
user_proxy.initiate_chat(assistant, message=task)
```

### 四、使用 CrewAI 开发团队协作 Agent

```python
# pip install crewai

from crewai import Agent, Task, Crew, Process
from langchain_openai import ChatOpenAI

# 创建 Agent
researcher = Agent(
    role="研究员",
    goal="收集和分析最新的AI技术趋势",
    backstory="你是一位资深的AI研究员，擅长技术趋势分析",
    verbose=True,
    allow_delegation=False,
    llm=ChatOpenAI(model="gpt-4", temperature=0.7)
)

writer = Agent(
    role="技术作家",
    goal="撰写清晰、有洞察力的技术文章",
    backstory="你是一位技术写作专家，擅长将复杂概念简单化",
    verbose=True,
    allow_delegation=False,
    llm=ChatOpenAI(model="gpt-4", temperature=0.7)
)

# 定义任务
research_task = Task(
    description="研究2024年最重要的3个AI突破，包括技术细节和影响",
    agent=researcher,
    expected_output="一份详细的研究报告"
)

writing_task = Task(
    description="基于研究报告，撰写一篇面向普通读者的科普文章",
    agent=writer,
    expected_output="一篇1000字左右的科普文章"
)

# 创建团队
crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, writing_task],
    process=Process.sequential,
    verbose=True
)

# 执行任务
result = crew.kickoff()
print(result)
```

### 五、RAG + Agent 实战

```python
from langchain import OpenAI, VectorDBQA
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.text_splitter import CharacterTextSplitter
from langchain.document_loaders import TextLoader
from langchain.agents import Tool, initialize_agent

# 1. 加载文档
loader = TextLoader("knowledge_base.txt")
documents = loader.load()

# 2. 分块
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
texts = text_splitter.split_documents(documents)

# 3. 创建向量数据库
embeddings = OpenAIEmbeddings()
vectordb = Chroma.from_documents(texts, embeddings)

# 4. 创建 RAG 工具
qa = VectorDBQA.from_chain_type(
    llm=OpenAI(),
    chain_type="stuff",
    vectorstore=vectordb
)

tools = [
    Tool(
        name="Knowledge Base",
        func=qa.run,
        description="用于查询知识库"
    )
]

# 5. 创建 Agent
agent = initialize_agent(
    tools,
    OpenAI(temperature=0),
    agent="zero-shot-react-description"
)

# 6. 使用
response = agent.run("根据知识库，什么是我们的退货政策？")
```

---

## 📋 快速上手清单

### Week 1: 基础入门
- [ ] 完成 [Google ML Crash Course](https://developers.google.com/machine-learning/crash-course)
- [ ] 学习 Python 基础 (如果还不熟悉)
- [ ] 安装并运行第一个 LLM (Ollama)

### Week 2: LLM 应用开发
- [ ] 学习 LangChain 基础
- [ ] 完成 [LangChain 官方教程](https://python.langchain.com/docs/get_started/quickstart)
- [ ] 开发第一个 RAG 应用

### Week 3: Agent 开发
- [ ] 学习 ReAct 架构
- [ ] 开发带工具的 Agent
- [ ] 实现记忆系统

### Week 4: 模型定制
- [ ] 学习 LoRA 微调
- [ ] 准备数据集
- [ ] 微调一个自己的模型

---

## 🔗 推荐项目练手

| 项目 | 难度 | 技术栈 | 描述 |
|------|------|--------|------|
| **智能客服** | ⭐⭐ | RAG, LangChain | 基于文档的问答系统 |
| **代码助手** | ⭐⭐⭐ | Agent, Code Interpreter | 自动编程助手 |
| **研报生成器** | ⭐⭐⭐ | Multi-Agent, CrewAI | 自动收集数据并生成报告 |
| **个人知识库** | ⭐⭐ | RAG, Vector DB | 管理个人笔记和文档 |
| **自动化工作流** | ⭐⭐⭐⭐ | Agent, Tool Use | 自动执行复杂任务 |

---

## 💡 学习建议

1. **动手优先**：不要只看教程，一定要动手写代码
2. **从简单开始**：先用现成的API和框架，再深入底层
3. **关注社区**：关注 Hugging Face, LangChain, OpenAI 的官方账号
4. **阅读源码**：理解优秀项目的实现方式
5. **持续迭代**：AI 发展很快，保持学习

---

*最后更新：2026-02-16 | NewClaw Learning Hub*