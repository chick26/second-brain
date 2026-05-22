---
status: todo
tags:
  - topic/ai
  - topic/llm
topic: Tokenization 分词
---

# 分词介绍

## 分词的目的与粒度

分词的目的：输入文本分成一个个词元（**token**），保证**各个词元拥有相对完整和独立的语义**，以供后续任务（比如学习 embedding 或者作为高级模型的输入）使用。
### 分词的三种粒度

> [!multi-column]
>
>> [!note] **词粒度 word**
>> 英文天生空格分开词汇，中文可以使用jieba 分词工具
>> **优点**：词的边界和含义得到保留
>> **缺点**：
>> - 词粒度的词表由于长尾效应可能会非常大，包含很多的稀有词，存储和训练的成本都很高，并且稀有词往往很难学好
>> - **OOV (out of vocabulary)** 问题，对于词表之外的词无能为力
>> - 无法处理单词的形态关系和词缀关系，同一个词的不同形态，语义相近，完全当做不同的单词不仅增加了训练成本，而且无法很好的捕捉这些单词之间的关系；同时，也无法学习词缀在不同单词之间的泛化
>
>> [!note] **字符粒度 char**
>> OOV 问题迎刃而解
>> **优点**：词表极小，比如 26 个英文字母可以组合出所有词，5000 多个中文常用字基本也能组合出足够的词汇，再加上一些常用字符
>> **缺点**：
>> - 无法承载丰富语义
>> - 序列长度增长，带来计算成本的增长
>
>> [!note] **子词粒度 subword**
>> 粒度介于 `char` 和 `word` 之间，基本思想为常用词应该保持原状，**生僻词应该拆分成子词以共享 token 压缩空间**
>> **优点**：可以**较好的平衡词表大小与语义表达能力**，比如 OOV 问题可以通过 `subword` 的组合来解决；三种主流的 Subword 分词算法，分别是**BPE，WordPiece**和**Unigram Language Model**
## 分词的实例

一个[可视化分词结果的网站]( https://tiktokenizer.vercel.app )，不通的的 Tokenizer 去可视化中文、英文、数字和代码的分词，大的模型分词器词汇表，相同的内容最后的token 总数更少，每一个 token 包含的连贯的语义更加准确

## 提升分词效果的意义

> [!Summary]+ **Tokenization 是很多 LLM 问题的核心**
> * 为什么大语言模型不会拼写单词？因为分词。
> * 为什么大语言模型无法完成像反转字符串这样极其简单的字符串处理任务？因为分词。
> * 为什么大语言模型在非英语语言（比如日语）上表现较差？因为分词。
> * 为什么大语言模型不擅长简单算术？因为分词。
> * 为什么 GPT-2 在 Python 编程时遇到了过多不必要的麻烦？因为分词。
> * 为什么我的大语言模型在看到字符串“<|endoftext|>”时会突然停止？因为分词。
> * 我收到的关于“尾部空格”的奇怪警告是怎么回事？因为分词。
> * 为什么当我询问“SolidGoldMagikarp”时，大语言模型会出错？因为分词。
> * 为什么在大语言模型中我最好使用 YAML 而不是 JSON？因为分词。
> * 为什么大语言模型实际上并不是端到端的语言建模？因为分词。
> * 痛苦的真正根源是什么？因为分词。
# 1.1.2 分词算法

## Byte Pair Encoding (BPE)

### BPE

> [!info]
> - 论文：[*Neural Machine Translation of Rare Words with Subword Units*]( https://arxiv.org/pdf/1508.07909)
> - 核心思想：从一个基础小词表开始，通过不断合并最高频的连续 token 对来产生新的 token
> - 具体做法： 入训练语料和期望词表大小V
> 	1. 准备基础词表：比如英文中 26 个字母加上各种符号，并初始化 ID
> 	2. 基于基础词表将准备的语料拆分为最小单元
> 	3. 在语料上统计单词内相邻单元对的频率，选择频率最高的单元对进行合并
> 	4. 重复第 3 步直到达到预先设定的 subword 词表大小或下一个最高频率为 1
> - 优点：以有效地平衡词汇表大小和编码步数 (编码句子所需的 token 数量，与词表大小和粒度有关)
> - 缺点：基于贪婪和确定的符号替换，不能提供带概率的多个分词结果 (这是相对于 ULM 而言的)；解码的时候面临歧义问题（比如对于同一个句子 `"Hello World"`，分词结果可能不同 `"Hell/o/world"` 或者 `"He/llo/world"`）

### BPE 示例

1. 准备语料库：; 备一个简单的语料库，通; `[词频]词语_`; 形式存储，这里的 `_` 表示词语结尾，包含五个单词及其词频， `er_` 和 `er` 意思不同， `er_` 只能放在结尾，组成 `newer_` 等， `er` 则不表示结尾，可以组成 `era` 等

| 词频  | 词       |
| --- | ------- |
| [5] | low_    |
| [2] | lowest_ |
| [6] | newer_  |
| [3] | wider_  |
| [2] | new_    |
2. 设置 token 词表的大小，或者循环的次数，作为终止条件
3. 统计每个字符出现的次数，结尾 `_` 的次数也要统计。这张表就是 vocabulary，后续迭代结束之后就会利用这张表进行分词

| 字符  | 频次  |
| --- | --- |
| \_  | 18  |
| d   | 3   |
| e   | 19  |
| i   | 3   |
| l   | 7   |
| n   | 8   |
| o   | 7   |
| r   | 9   |
| s   | 2   |
| t   | 2   |
| w   | 22  |
4. 选择两个连续的字符（序）进行合并，并且合并后有着最高的频次。第一次迭代，选择 `r` 和 `_`，组合成 `r_`，总共有 6 + 3 = 9 次。然后我们将“r_”和它的频次加入 vocabulary，并且减去 `r` 和 `_` 的次数。此时，`r` 的频次变成 0，说明 `r` 的出现一定会与“\_”关联，也就是说 `r` 一定是最后一个单词。这个时候可以把 `r` 从词表里删除，词表由于增加了一个 `r_` ，减少了一个 `r` ，所以长度不变。（这里也是为什么大家总说词表一般情况是先增加后减少）

| 字符    | 频次  |
| ----- | --- |
| \_    | 9   |
| d     | 3   |
| e     | 19  |
| i     | 3   |
| l     | 7   |
| n     | 8   |
| o     | 7   |
| **r** | 0   |
| s     | 2   |
| t     | 2   |
| w     | 22  |
| r\_   | 9   |
5. 接下来合并 `e` 和 `r_`，因为 `er_` 总共出现了 6 + 3 = 9 次是当前频次最高的，同样更新词表。增加了 `er_`，减少了 `r_`，所以词表长度不变

| 字符   | 频次  |
| ---- | --- |
| \_   | 9   |
| d    | 3   |
| e    | 10  |
| i    | 3   |
| l    | 7   |
| n    | 8   |
| o    | 7   |
| s    | 2   |
| t    | 2   |
| w    | 22  |
| er\_ | 9   |
| r_   | 0   |

6. 然后合并 `ew`，共出现 8 次，更新后的表 `（_, d, e, i, l, n, o, s, t, w, er_, ew）`。这次 `ew` 没有消除所有的 `e` 或 `w`，也就是说 `e` 或 `w` 除了出现 `ew` 中还会出现在别的地方，比如 `wider` 中的 `e` 和 `w` 就是分开的。所以词表的长度增加了1
7. 接着就是 `new`，总共 8 次，更新后的表 `（_, d, e, i, l, o, s, t, w, er_, new）`。此时的 `new` 消除了所有的 `n` 和 `ew`，也就是 `n` 和 `ew` 只会出现在 `new` 里面。这时词表增加了一个“new”但消除了两个，所以词表的长度减少了1
8. 假设我设置循环四次后终止，那么此时的词表就是 `（_, d, e, i, l, o, s, t, w, er_, new）`
9. 根据上述描述，也就可以发现，词表长度的变化总共有三种，+1、-1、不变

### BPE 代码

主要有两个函数，一个专门统计 vocabulary，另一个负责合并字符串。统计词频很暴力，就是遍历 vocabulary 里每一个元素，利用像两个元素的滑动窗口，挨个组合并且记录频次。找到频次最高的之后进行合并并且输出新的 vocabulary

- 统计词频

```python
import re, collections
text = "The aims for this subject is for students to develop an understanding of the main algorithms used in naturallanguage processing, for use in a diverse range of applications including text classification, machine translation, and question answering. Topics to be covered include part-of-speech tagging, n-gram language modelling, syntactic parsing and deep learning. The programming language used is Python, see for more information on its use in the workshops, assignments and installation at home."
# text = 'low '*5 +'lower '*2+'newest '*6 +'widest '*3
'''
先统计词频
'''
def get_vocab(text):
    
    # 初始化为 0
    vocab = collections.defaultdict(int)
    # 去头去尾再根据空格split
    for word in text.strip().split():
        #note: we use the special token </w> (instead of underscore in the lecture) to denote the end of a word
        # 给list中每个元素增加空格，并在最后增加结束符号，同时统计单词出现次数
        vocab[' '.join(list(word)) + ' </w>'] += 1
    return vocab
print(get_vocab(text))
```

- 统计相邻字符对频率

```python
"""
这个函数遍历词汇表中的所有单词，并计算彼此相邻的一对标记。
EXAMPLE:
    word = 'T h e <\w>'
    这个单词可以两两组合成： [('T', 'h'), ('h', 'e'), ('e', '<\w>')]    
输入:
    vocab: Dict[str, int]  # vocab统计了词语出现的词频  
输出:
    pairs: Dict[Tuple[str, str], int] # 字母对，pairs统计了单词对出现的频率
"""
def get_stats(vocab):
	pairs = collections.defaultdict(int)
    
    for word,freq in vocab.items():
        
        # 遍历每一个word里面的symbol，去凑所有的相邻两个内容
        symbols = word.split()
        for i in range(len(symbols)-1):
            pairs[(symbols[i],symbols[i+1])] += freq

    return pairs
```

* 合并高频字符对

```python
"""
EXAMPLE:
    word = 'T h e <\w>'
    pair = ('e', '<\w>')
    word_after_merge = 'T h e<\w>'    
输入:
    pair: Tuple[str, str] # 需要合并的字符对
    v_in: Dict[str, int]  # 合并前的vocab   
输出:
    v_out: Dict[str, int] # 合并后的vocab    
注意:
    当合并word 'Th e<\w>'中的字符对 ('h', 'e')时，'Th'和'e<\w>'字符对不能被合并。
"""
def merge_vocab(pair, v_in):
    v_out = {}
    # 把pair拆开，然后用空格合并起来，然后用\把空格转义
    bigram = re.escape(' '.join(pair))
    # 自定义一个正则规则, (?<!\S)h\ e(?!\S) 只有前面、后面不是非空白字符(\S)(意思前后得是没东西的)，才匹配h\ e，这样就可以把Th\ e<\w>排除在外
    p = re.compile(r'(?<!\S)' + bigram + r'(?!\S)')
    
    for v in v_in:
        # 遍历当前的vocabulary，找到匹配正则的v时，才用合并的pair去替换变成新的pair new，如果没有匹配上，那就保持原来的。
        # 比如pair当前是'h'和'e'，然后遍历vocabulary，找到符合前后都没有东西只有'h\ e'的时候就把他们并在一起变成'he'
        new = p.sub(''.join(pair),v)
        # 然后新的合并的数量就是当前vocabulary里面pair对应的数量
        v_out[new] = v_in[v]
    return v_out
def get_tokens(vocab):
    tokens = collections.defaultdict(int)
    for word, freq in vocab.items():
        word_tokens = word.split()
        for token in word_tokens:
            tokens[token] += freq
    return tokens
vocab = get_vocab(text)
print("Vocab =", vocab)
print('==========')
print('Tokens Before BPE')
tokens = get_tokens(vocab)
print('Tokens: {}'.format(tokens))
print('Number of tokens: {}'.format(len(tokens)))
print('==========')
#about 100 merges we start to see common words
num_merges = 100
for i in range(num_merges):
    pairs = get_stats(vocab)
    if not pairs:
        break
    
    # vocabulary里面pair出现次数最高的作为最先合并的pair
    best = max(pairs, key=pairs.get)
    
    # 先给他合并了再说，当然这里不操作也没什么，到merge_vocab里面都一样
    new_token = ''.join(best)
    vocab = merge_vocab(best, vocab)
    print('Iter: {}'.format(i))
    print('Best pair: {}'.format(best))
    # add new token to the vocab
    tokens[new_token] = pairs[best]
    # deduct frequency for tokens have been merged
    tokens[best[0]] -= pairs[best]
    tokens[best[1]] -= pairs[best]
    print('Tokens: {}'.format(tokens))
    print('Number of tokens: {}'.format(len(tokens)))
    print('==========')
    print('vocab, ', vocab)
```

* 分词示例，应用上面代码产生的 vocabulary

```python
def get_tokens_from_vocab(vocab):
    tokens_frequencies = collections.defaultdict(int)
    vocab_tokenization = {}
    for word, freq in vocab.items():
        # 看vocabulary里面的token频率，相当于上面的code中的tokens去除freq为0的
        word_tokens = word.split()
        for token in word_tokens:
            tokens_frequencies[token] += freq
        # vocab和其对应的tokens
        vocab_tokenization[''.join(word_tokens)] = word_tokens
    return tokens_frequencies, vocab_tokenization

def measure_token_length(token): 
    # 如果token最后四个元素是 < / w >
    if token[-4:] == '</w>':
        # 那就返回除了最后四个之外的长度再加上1(结尾)
        return len(token[:-4]) + 1
    else:
        # 如果这个token里面没有结尾就直接返回当前长度
        return len(token)
    
# 如果vocabulary里面找不到要拆分的词，就根据已经有的token现拆
def tokenize_word(string, sorted_tokens, unknown_token='</u>'):
    
    # base case，没词进来了，那拆的结果就是空的
    if string == '':
        return []
    # 已有的sorted tokens没有了，那就真的没这个词了
    if sorted_tokens == []:
        return [unknown_token] * len(string)

    # 记录拆分结果
    string_tokens = []
    
    # iterate over all tokens to find match
    for i in range(len(sorted_tokens)):
        token = sorted_tokens[i]
        
        # 自定义一个正则，然后要把token里面包含句号的变成[.]
        token_reg = re.escape(token.replace('.', '[.]'))
        
        # 在当前string里面遍历，找到每一个match token的开始和结束位置，比如string=good，然后token是o，输出[(1,2),(2,3)]?
        matched_positions = [(m.start(0), m.end(0)) for m in re.finditer(token_reg, string)]
        # if no match found in the string, go to next token
        if len(matched_positions) == 0:
            continue
        # 因为要拆分这个词，匹配上的token把这个word拆开了，那就要拿到除了match部分之外的substring，所以这里要拿match的start
        substring_end_positions = [matched_position[0] for matched_position in matched_positions]
        substring_start_position = 0
        
        
        # 如果有匹配成功的话，就会进入这个循环
        for substring_end_position in substring_end_positions:
            # slice for sub-word
            substring = string[substring_start_position:substring_end_position]
            # tokenize this sub-word with tokens remaining 接着用substring匹配剩余的sorted token，因为刚就匹配了一个
            string_tokens += tokenize_word(string=substring, sorted_tokens=sorted_tokens[i+1:], unknown_token=unknown_token)
            # 先把sorted token里面匹配上的记下来
            string_tokens += [token]
            substring_start_position = substring_end_position + len(token)
        # tokenize the remaining string 去除前头的substring，去除已经匹配上的，后面还剩下substring_start_pos到结束的一段substring没看
        remaining_substring = string[substring_start_position:]
        # 接着匹配
        string_tokens += tokenize_word(string=remaining_substring, sorted_tokens=sorted_tokens[i+1:], unknown_token=unknown_token)
        break
    else:
        # return list of unknown token if no match is found for the string
        string_tokens = [unknown_token] * len(string)
        
    return string_tokens

"""
该函数生成一个所有token的列表，按其长度（第一键）和频率（第二键）排序。

EXAMPLE:
    token frequency dictionary before sorting: {'natural': 3, 'language':2, 'processing': 4, 'lecture': 4}
    sorted tokens: ['processing', 'language', 'lecture', 'natural']
    
INPUT:
    token_frequencies: Dict[str, int] # Counter for token frequency
    
OUTPUT:
    sorted_token: List[str] # Tokens sorted by length and frequency

"""
def sort_tokens(tokens_frequencies):
    # 对 token_frequencies里面的东西，先进行长度排序，再进行频次，sorted是从低到高所以要reverse
    sorted_tokens_tuple = sorted(tokens_frequencies.items(), key=lambda item:(measure_token_length(item[0]),item[1]), reverse=True)
    
    # 然后只要tokens不要频次
    sorted_tokens = [token for (token, freq) in sorted_tokens_tuple]

    return sorted_tokens

#display the vocab
tokens_frequencies, vocab_tokenization = get_tokens_from_vocab(vocab)

#sort tokens by length and frequency
sorted_tokens = sort_tokens(tokens_frequencies)
print("Tokens =", sorted_tokens, "\n")

#print("vocab tokenization: ", vocab_tokenization)

sentence_1 = 'I like natural language processing!'
sentence_2 = 'I like natural languaaage processing!'
sentence_list = [sentence_1, sentence_2]

for sentence in sentence_list:
    
    print('==========')
    print("Sentence =", sentence)
    
    for word in sentence.split():
        word = word + "</w>"

        print('Tokenizing word: {}...'.format(word))
        if word in vocab_tokenization:
            print(vocab_tokenization[word])
        else:
            print(tokenize_word(string=word, sorted_tokens=sorted_tokens, unknown_token='</u>'))
```

## Byte-level BPE (BBPE)

### BBPE 介绍

> 论文：*Neural Machine Translation with Byte-Level Subwords*
>
> 链接：https://arxiv.org/pdf/1909.03341
>
> * 核心思想：BPE 从字符级别扩展 ;字节级别， ; 自噪声文本或字符丰富的语言（如日语和中文）的稀有字符可能会不必要地占用词汇表并限制其紧凑性
>
> * 具体做法：础词表使用256 的字节集，UTF-8 编码
>
> * 优点：
>
>   1. 效果与 BPE 相当，但词表大为减小
>   2. 可以;多语言之间通过字节级别的子词实现更好的共享
>   3. 即使字符集不重叠，也可以通过字节层面的共享来实现良好的迁移
>   4. 高效的压缩效果; BPE 可以根据文本中的重复模式和常见片段来动态地生成词汇表，从而实现高效的文本压缩，尤其适用于包含大量重复内容的文本数据。
>   5. 适用于多种类型的数据：BPE 可以应用于各种类型的数据，包括文本数据、图像数据等，因为它是基于字节级别的编码方法
>   6. 无损压缩：许多基于统计方法的压缩算法相比，BBPE 是一种无损压缩算法，可以确保压缩后的数据与原始数据之间没有信息损失
>   7. 可解码性：BBPE 使用动态生成的词汇表来编码文本数据，因此可以轻松地将编码后的数据解码回原始数据
>   8. 灵活性 BPE 的压缩效果和词汇表大小可以根据需求进行调整，以满足不同场景下的需求
>
> * 缺点：
>
>   1. 编码序列时，长度可能会略长于 BPE，计算成本更高
>   2. 由byte 解码时可能会遇到歧义，需要通过上下文信息和动态规划来进行解码证输出有效的句子
>   3. 实际上的 GPT 2 tokenizer 的代码也就是下面贴出来的代码中并没有这两部分的实现，这里贴一个仓库，里面有原本 BBPE 论文的实现，包括用 GRU 进行上下文信息融合和动态规划解码， https://gitee.com/wangyizhen/fairseq/blob/master/fairseq/data/encoders/byte\_utils.py
>   > https://gitee.com/wangyizhen/fairseq/blob/master/examples/byte\_level\_bpe/gru\_transformer.py

### BBPE 与 BPE 的对比

可以看到 BBPE 分词结果出现了字节级别的 token

![](https://kcnd4kn8i6ap.feishu.cn/space/api/box/stream/download/asynccode/?code=NTA2YzBkMGE4ZTQ5Y2U2Njk0NjBhZDAyYTMyZDExZjRfeFVXbmhncHRhUFl3NXNjOG5WTmxJNjNrdURqdGE2S2xfVG9rZW46T0xqZWJkQ0Zpb3BDdDB4bXRoY2NZbmVRbjhjXzE3Njk0MTk1MDE6MTc2OTQyMzEwMV9WNA)

![](https://kcnd4kn8i6ap.feishu.cn/space/api/box/stream/download/asynccode/?code=NmM0NGEzNTAzNTlhNmJmZDM1Y2M1ZDdlMmVjNzM1MGFfRlBybldKRWN3a3RlRGZjc0RNTFpxQ0ZzZjd4UVNnZHJfVG9rZW46TGd1T2Jtb0Vhb2xnVWZ4ZEhDY2NrMGp6bkFkXzE3Njk0MTk1MDE6MTc2OTQyMzEwMV9WNA)
### BBPE 代码

```python
import torch
import torch.nn as nn
import regex as re
import json
from collections import Counter
from concurrent.futures import ThreadPoolExecutor

def bytes_to_unicode():
    """
    返回utf-8字节列表和到unicode字符串的映射。我们特别避免映射到bbpe代码所依赖的空白/控制字符。
    可逆的bbpe代码在unicode字符串上工作。这意味着如果您想避免UNKs，您需要在您的词汇表中使用大量的unicode字符。
    当你有一个10B的token数据集时，你最终需要大约5K才能获得良好的覆盖。这是你正常情况下的一个显著比例，
    比如说，32K的词汇量。为了避免这种情况，我们希望查找表介于utf-8字节和unicode字符串之间。
    """
    bs = (
            list(range(ord("!"), ord("~") + 1)) + list(range(ord("¡"), ord("¬") + 1)) + list(
        range(ord("®"), ord("ÿ") + 1))
    )
    cs = bs[:]
    n = 0
    for b in range(2  8):
        if b not in bs:
            bs.append(b)
            cs.append(2  8 + n)
            n += 1
    cs = [chr(n) for n in cs]
    return dict(zip(bs, cs))

class BBPETokenizer(nn.Module):
    def __init__(self, vocab_path: str, merges_path: str):
        super().__init__()
        with open(vocab_path, "r", encoding="utf-8") as f:  # 获得词表
            vocab = json.load(f)
        with open(merges_path, "r", encoding="utf-8") as f:  # 获得合并token规则词表
            merges = f.read()

        # 将合并存储为元组列表，删除最后一个空白行
        merges = [tuple(merge_str.split()) for merge_str in merges.split("\n")[:-1]]

        # token到BBPE解码索引映射
        self.encoder = vocab
        self.decoder = {v: k for k, v in self.encoder.items()}

        # 字节到unicode字符映射，256个字符
        self.byte_encoder = bytes_to_unicode()
        self.byte_decoder = {v: k for k, v in self.byte_encoder.items()}

        self.bbpe_ranks = dict(zip(merges, range(len(merges))))
        self.cache = {}

        # 预标记化拆分正则表达式模式
        self.pat = re.compile(r"""
                                 's|'t|'re|'ve|'m|'ll|'d|  # 常见的收缩
                                 \ ?\p{L}+|\ ?\p{N}+|  # 可选空格，后跟1+ unicode字母或数字
                                 \ ?[^\s\p{L}\p{N}]+|  # 可选空格，后面跟着1+非空白/字母/数字
                                 \s+(?!\S)|  # 1+空白字符，后面没有非空白字符
                                 \s+  # 1+空格字符
                                 """, re.X)

    def forward(self, text):
        if isinstance(text, list):
            # 批量编码
            tokens = self.encode_batch(text)
            tokens = [token for row in tokens for token in row]
        else:
            # 编码字符串
            tokens = self.encode(text)
        return torch.tensor(tokens)

    def bbpe(self, token):
        '''
        对token应用合并规则
        '''
        if token in self.cache:
            return self.cache[token]

        chars = [i for i in token]
        # 对于每个合并规则，尝试合并任何相邻的字符对
        for pair in self.bbpe_ranks.keys():
            i = 0
            while i < len(chars) - 1:
                if chars[i] == pair[0] and chars[i + 1] == pair[1]:
                    chars = chars[:i] + ["".join(pair)] + chars[i + 2:]
                else:
                    i += 1
        self.cache[token] = chars
        return chars

    def encode(self, text: str) -> list[int]:
        '''
        将字符串编码为BBPE token
        '''
        bbpe_tokens_id = []
        # pattern使用要输入BBPE算法的正则表达式模式拆分文本
        for token in re.findall(self.pat, text):
            # 将token转换为其字节表示，将字节映射到其unicode表示
            token = "".join(self.byte_encoder[b] for b in token.encode("utf-8"))
            # 对token执行bbpe合并，然后根据编码器将结果映射到它们的bbpe索引
            bbpe_tokens_id.extend(self.encoder[bpe_token] for bpe_token in self.bbpe(token))
        return bbpe_tokens_id

    def tokenize(self, text):
        """
        获得编码后的字符
        :param text: 文本
        :return: 返回编码后的字符
        """
        bbpe_tokens = []
        # pattern使用要输入BBPE算法的正则表达式模式拆分文本
        for token in re.findall(self.pat, text):
            # 将token转换为其字节表示，将字节映射到其unicode表示
            token = "".join(self.byte_encoder[b] for b in token.encode("utf-8"))
            # 对token执行bbpe合并，然后根据编码器获得结果
            bbpe_tokens.extend(bpe_token for bpe_token in self.bbpe(token))
        return bbpe_tokens

    def encode_batch(self, batch: list[str], num_threads=4):
        '''
        将字符串列表编码为BBPE token列表
        '''
        with ThreadPoolExecutor(max_workers=num_threads) as executor:
            result = executor.map(self.encode, batch)
        return list(result)

    def decode(self, tokens) -> str:
        if isinstance(tokens, torch.Tensor):
            tokens = tokens.tolist()
        text = "".join([self.decoder[token] for token in tokens])
        text = bytearray([self.byte_decoder[c] for c in text]).decode("utf-8", errors="replace")
        return text

    @staticmethod
    def train_tokenizer(data, vocab_size, vocab_outfile=None, merges_outfile=None):
        """
        :param data: 训练文本
        :param vocab_size: 保留词表的大小
        :param vocab_outfile: 保存词表的文件名
        :param merges_outfile: 保存合并字节的词表
        """

        if vocab_size < 256:
            raise ValueError("vocab_size must be greater than 256")

        # 预标记数据
        byte_encoder = bytes_to_unicode()
        pat_str = r"'s|'t|'re|'ve|'m|'ll|'d| ?[\p{L}]+| ?[\p{N}]+| ?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+"
        split_words = [
            [byte_encoder[b] for b in token.encode("utf-8")] for token in re.findall(pat_str, data)
        ]
        # 向词汇表中添加基本词汇
        vocab = set(byte_encoder.values())
        merges = []

        # 构建词汇表，直到满足所需的词汇量
        while len(vocab) < vocab_size:
            print(len(vocab))
            pair_freq = Counter()
            # 找出最常见的一对
            for split_word in split_words:
                pair_freq.update(zip(split_word[:-1], split_word[1:]))
            most_common_pair = pair_freq.most_common(1)[0][0]

            #  更新词汇表和合并列表
            new_token = most_common_pair[0] + most_common_pair[1]
            vocab.add(new_token)
            merges.append(most_common_pair)

            # 对数据执行合并
            new_split_words = []
            for split_word in split_words:
                i = 0
                new_word = []
                # 对于单词中的每个重字符，尝试合并
                while i < len(split_word) - 1:
                    if (split_word[i], split_word[i + 1]) == most_common_pair:
                        new_word.append(new_token)
                        i += 2
                    else:
                        new_word.append(split_word[i])
                        i += 1
                if i == len(split_word) - 1:
                    new_word.append(split_word[i])
                new_split_words.append(new_word)
            split_words = new_split_words

        vocab = sorted(list(vocab))
        # 保存文件
        if merges_outfile != None:
            with open(merges_outfile, "w", encoding="utf-8") as f:
                for merge in merges:
                    f.write(merge[0] + " " + merge[1] + "\n")
        if vocab_outfile != None:
            with open(vocab_outfile, "w", encoding="utf-8") as f:
                json.dump({v: i for i, v in enumerate(vocab)}, f, ensure_ascii=False)
```

## WordPiece

### WordPiece 介绍

> 论文：*Fast WordPiece Tokenization*
>
> 链接： https://arxiv.org/pdf/2012.15524
>
> * 核心思想：BPE 类似，也是从一个基础小词表出发，通过不断合并来产生最终的词表。主要的差别在于，BPE 按频率来选择合并的 token 对, wordpiece 按 token 间的互信息来进行合并
>
> * 具体做法：入训练语料和词表大小V
>
>   1. 准备基础词表：比如英文中 26 个字母加上各种符号
>
>   2. 基于基础词表将语料拆分为最小单元
>
>   3. 基于第 2 步数据训练语言模型，可以是 unigram 语言模型，通过极大似然进行估计即可
>
>   4. 从所有可能得 token 对中选择，选取合并后可以最大程度地增加训练数据概率的 token 对进行合并，假设句子由 N 个子词组成 $$S=(t_1,t_2,...,t_N)$$，句子 $$S$$ 的似然值等于所有子词概率的乘积：
>
>      $$\log P(s)=\sum_{i=1}^{N}\log P(t_i)$$
>
>      假设各个子词相互独立。合并相邻两个子词 $$x$$ 和 $$y$$ 产生新的子词 $$z$$，句子的似然值变化为两个子词之间的互信息：
>
>      $$\log P(t_z) - (\log P(t_x)+\log P(t_y)) = \log \frac{P(t_z)}{P(t_x)P(t_y)}$$
>
>      其实就是每次选择互信息最大的两个子词合并，两个子词在语言模型上有较强的关联性，P 表示子词在语料中出现的频率，具体计算得分的时候不取 log：
>
>      $$\text{score}=\frac{P(t_z)}{P(t_x)P(t_y)}$$
>
>   5. 重复第 4 步直到达到预先设定的 subword 词表大小或概率增量低于某一阈值
>
> * 优点：& #x53EF ; 以较好的平衡词表大小和 OOV 问题
>
> * 缺点：& #x53EF ; 能会产生一些不太合理的子词或者说错误的切分；对拼写错误非常敏感；对前缀的支持不够好；& #x4E00 ; 种解决方案是：将复合词拆开、将前缀也拆开

### WordPiece 代码

主要区别就是计算`score`的部分，BPE 计算`freq`，WordPiece 计算`score`

```python
def compute_pair_scores (splits):
    letter_freqs = defaultdict (int)
    pair_freqs = defaultdict (int)
    for word, freq in word_freqs.items ():
        split = splits[word]
        if len (split) == 1:
            letter_freqs[split[0]] += freq
            continue
        for i in range (len (split) - 1):
            pair = (split[i], split[i + 1])
            letter_freqs[split[i]] += freq
            pair_freqs[pair] += freq
        letter_freqs[split[-1]] += freq

    scores = {
        pair: freq / (letter_freqs[pair[0]] * letter_freqs[pair[1]])
        for pair, freq in pair_freqs.items ()
    }
    return scores

def merge_pair (a, b, splits):
    for word in word_freqs:
        split = splits[word]
        if len (split) == 1:
            continue
        i = 0
        while i < len (split) - 1:
            if split[i] == a and split[i + 1] == b:
                merge = a + b[2:] if b.startswith ("##") else a + b
                split = split[: i] + [merge] + split[i + 2 :]
            else:
                i += 1
        splits[word] = split
    return splits

vocab_size = 70
while len (vocab) < vocab_size:
    scores = compute_pair_scores (splits)
    best_pair, max_score = "", None
    for pair, score in scores.items ():
        if max_score is None or max_score < score:
            best_pair = pair
            max_score = score
    splits = merge_pair (*best_pair, splits)
    new_token = (
        best_pair[0] + best_pair[1][2:]
        if best_pair[1]. startswith ("##")
        else best_pair[0] + best_pair[1]
    )
    vocab.append (new_token)
```

## Unigram Language Model (ULM)

### ULM 介绍

> * 核心思想：& #x521D ; 始化一个大词表，然& #x540E ;<span style="color: rgb (216,57,49); background-color: inherit">通过 unigram 语言模型计算删除不同 subword 造成的损失来代表 subword 的重要性，保留 loss 较大或者说重要性较高的 subword</span>，& #x55 ; LM 会倾向于保留那些以较高频率出现在很多句子的分词结果中的子词，因为这些子词如果被删除，其损失会很大
>
> * 具体做法：& #x8F93 ; 入训练语料和词表大小V
>
>   1. 准备基础词表：& #x521D ; 始化一个很大的词表，比如所有字符+高频 ngram，也可以通过 BPE 算法初始化
>
>   2. 针对当前词表，用语言模型（unigram lm) 估计每个子词在语料上的概率，比如 EM 算法，维特比算法寻找最优分割
>
>   3. 计算删除每个 subword 后对总 loss 的影响，作为该 subword 的 loss
>
>   4. 将子词按照 loss 大小进行排序，保留前 x%的子词；注意，单字符不能被丢弃，以免 OOV
>
>   5. 重复步骤 2 到 4，直到词表大小减少到设定值
>
> * 优点：
>
>   1. 使用的训练算法可以利用所有可能的分词结果，这是通过 data sampling 算法实现的
>
>   2. 提出一种基于语言模型的分词算法，这种语言模型可以给多种分词结果赋予概率，从而可以学到其中的噪声
>
>   3. 使用时也可以给出带概率的多个分词结果
>
> * 缺点：
>
>   1. 效果与初始词表息息相关，初始的大词表要足够好，比如可以通过 BPE 来初始化
>
>   2. 略显复杂

### ULM 分词例子

结论：& #x5220 ; 除 token 的节点不能删除单字的 token（如 a, b, c），因为会只要保留单字，任何单词都可以存在一种使用单字进行分词的方法（如 apple 可以分为 a, p, p, l, e）；挑选最大似然的分词结果中可以采& #x7528 ;<span style="color: rgb (36,91,219); background-color: inherit">维特比算法</span>& #x4ECE ; 而避免进行暴力枚举

1. 初始化大词表：& #x5DE6 ; 侧是 corpus 以及对应出现的次数，右侧是构建出的词表。这里的构建采用任何方式都行，如 BPE，但要注意两点：所有的单个字符（如 h, u, g）必须出现在词表当中；构建出的词表必须要能 cover 当前的 corpus，不然下一步计算概率就会失败

   ![](https://kcnd4kn8i6ap.feishu.cn/space/api/box/stream/download/asynccode/?code=ODI5ODQ3OTE5MjI1ZGQ0MjIxNTVjMTkxZmQ5ODViY2FfdkhpNGNqQXJ1R2pjRmRDbVI5czRMSFJEVDI0aGdzbFNfVG9rZW46QVE5bGJZcDlCb3BaV1R4cUlZMWNqODQzblBmXzE3Njk0MTk1MDE6MTc2OTQyMzEwMV9WNA)

2. 挑选最大似然的分词结果：& #x6B64 ; 处拿 hug 举例，hug 在当前词表中可以暴力枚举有 4 种分词方法：`h, u, g`，`hu, g`，`h, ug`，`hug`，其中前 3 种都在词汇表中，第四种 hug 不在。可以计算出最大的那个概率 1.11 e-02

   ![](https://kcnd4kn8i6ap.feishu.cn/space/api/box/stream/download/asynccode/?code=YjNhM2Y2NDA4NDk0NzdmZTJkN2QzYWJlNGZjMjAzYmFfQThNcmRaYUxhUndnYmNQUHR5d3BrRXVCbndoQTJTYzFfVG9rZW46SmFoQmJiRDJnb0NMZk54MFphb2NaRFVxbmxoXzE3Njk0MTk1MDE6MTc2OTQyMzEwMV9WNA)

   对所有 corpus 都进行如下计算，之后求弄个加权求和，作为 Loss，初始的 Loss 总值为 170.40

   ![](https://kcnd4kn8i6ap.feishu.cn/space/api/box/stream/download/asynccode/?code=NGUxOTJjYWRhNzZjODcwMDA3N2NiNDI4NmEzMDFkODVfS0dCMmZoTkRjU2U0WHFLZTlTbU9NM2gyTE42dkxoNWtfVG9rZW46V256amJxaDNub2F6cXB4cE5TNWM5UEw4bjhvXzE3Njk0MTk1MDE6MTc2OTQyMzEwMV9WNA)

3. 精简词汇表：& #x4ECE ; 上图的结果可以看到，有一个 token 是没有使用的，就是 ug。精简词汇表的原则是移除影响 loss 最少的 token。首先先从词汇表中删除 ug，可以看到即使删除 ug，根据上图的分词方法，Loss 值不会有变化。理论上包括 ug 在内，剩下的 hu, pu, lu, bu, du 这几个词在第一轮精简的时候单独删除都不会影响 Loss 如下图左所示（例如：单独删除 hu，hug 还可以表示为 h, ug），& #x6240 ; 以我们可以随机删除一个 token，就选择没有出现的 ug 吧

   | ![](https://kcnd4kn8i6ap.feishu.cn/space/api/box/stream/download/asynccode/?code=ODRjZDYyY2Q4ZGMxZTVkYjgwMmFjY2RjZjBhYmU5ZTJfeWlKeWQ4OUhEdU50NURSQTlZdTdORFFwdERCYlZoZkxfVG9rZW46Sk5QMWJZVm56b1dlNHF4ajVTYWNyd1gybldnXzE3Njk0MTk1MDE6MTc2OTQyMzEwMV9WNA) | ![](https://kcnd4kn8i6ap.feishu.cn/space/api/box/stream/download/asynccode/?code=MGVhNGIzZGQ0ZmU2N2U0MjgwMTNiZWEzMDM4MjdlM2RfV2J5RFdJR3hPNktIWEpibXdxV0RKZVUxZlMyT21icFlfVG9rZW46R0dhVmJFakp6bzBWVkd4U29nQmNydmFkbk5iXzE3Njk0MTk1MDE6MTc2OTQyMzEwMV9WNA) |
   | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

   token 被删除后，会影响其他 token 的概率计算（因为基数从 180 个减少了，上图右），然后就是第二轮删除 token。下图是删除各个单词后 Loss 的情况，bu 对应的 Loss 最小，故删除 bu。然后重复上述过程，直到达到设定的词表大小

   ![](https://kcnd4kn8i6ap.feishu.cn/space/api/box/stream/download/asynccode/?code=Y2RjMzliZDc0NzA3NjRlMmU2ZjMzYzcwNjQyZThjZDVfOVoyQXQxVjFxTWlmdm52akpadnQ0TU1vUVowMVhBSURfVG9rZW46S2Y2Q2JZdjE4bzJZYnl4R0cyc2MxTk5Kbm9iXzE3Njk0MTk1MDE6MTc2OTQyMzEwMV9WNA)

### ULM 分词代码

```python
from transformers import AutoTokenizer
tokenizer = AutoTokenizer. from_pretrained ("xlnet-base-cased")
from collections import defaultdict
word_freqs = defaultdict (int)
for text in corpus:
    words_with_offsets = tokenizer. backend_tokenizer. pre_tokenizer. pre_tokenize_str (text)
    new_words = [word for word, offset in words_with_offsets]
    for word in new_words:
        word_freqs[word] += 1
char_freqs = defaultdict (int)
subwords_freqs = defaultdict (int)
for word, freq in word_freqs.items ():
    for i in range (len (word)):
        char_freqs[word[i]] += freq
        # Loop through the subwords of length at least 2
        for j in range (i + 2, len (word) + 1):
            subwords_freqs[word[i: j]] += freq

# Sort subwords by frequency
sorted_subwords = sorted (subwords_freqs.items (), key=lambda x: x[1], reverse=True)
token_freqs = list (char_freqs.items ()) + sorted_subwords[: 300 - len (char_freqs)]
token_freqs = {token: freq for token, freq in token_freqs}

from math import log
total_sum = sum ([freq for token, freq in token_freqs.items ()])
model = {token: -log (freq / total_sum) for token, freq in token_freqs.items ()}

def encode_word (word, model):
    best_segmentations = [{"start": 0, "score": 1}] + [
        {"start": None, "score": None} for _ in range (len (word))
    ]
    for start_idx in range (len (word)):
        # This should be properly filled by the previous steps of the loop
        best_score_at_start = best_segmentations[start_idx]["score"]
        for end_idx in range (start_idx + 1, len (word) + 1):
            token = word[start_idx: end_idx]
            if token in model and best_score_at_start is not None:
                score = model[token] + best_score_at_start
                # If we have found a better segmentation ending at end_idx, we update
                if (
                    best_segmentations[end_idx]["score"] is None
                    or best_segmentations[end_idx]["score"] > score
                ):
                    best_segmentations[end_idx] = {"start": start_idx, "score": score}

    segmentation = best_segmentations[-1]
    if segmentation["score"] is None:
        # We did not find a tokenization of the word -> unknown
        return ["<unk>"], None

    score = segmentation["score"]
    start = segmentation["start"]
    end = len (word)
    tokens = []
    while start != 0:
        tokens.insert (0, word[start: end])
        next_start = best_segmentations[start]["start"]
        end = start
        start = next_start
    tokens.insert (0, word[start: end])
    return tokens, score

def compute_loss (model):
    loss = 0
    for word, freq in word_freqs.items ():
        _, word_loss = encode_word (word, model)
        loss += freq * word_loss
    return loss

import copy
def compute_scores (model):
    scores = {}
    model_loss = compute_loss (model)
    for token, score in model.items ():
        # We always keep tokens of length 1
        if len (token) == 1:
            continue
        model_without_token = copy.deepcopy (model)
        _ = model_without_token.pop (token)
        scores[token] = compute_loss (model_without_token) - model_loss
    return scores

percent_to_remove = 0.1
while len (model) > 100:
    scores = compute_scores (model)
    sorted_scores = sorted (scores.items (), key=lambda x: x[1])
    # Remove percent_to_remove tokens with the lowest scores.
    for i in range (int (len (model) * percent_to_remove)):
        _ = token_freqs.pop (sorted_scores[i][0])

    total_sum = sum ([freq for token, freq in token_freqs.items ()])
    model = {token: -log (freq / total_sum) for token, freq in token_freqs.items ()}
```

# 1.1.3 常用分词库

## SentencePiece

> * 多分词粒度：支持完整和高性能的 BPE、ULM 子词算法，也支持`char, word`分词
>
> * 多语言：以 unicode 方式编码字符，将所有的输入（英文、中文等不同语言）都转化为 unicode 字符，解决了多语言编码方式不同的问题
>
> * 编解码的可逆性：之前几种分词算法对空格的处理略显粗暴，有时是无法还原的。Sentencepiece 显式地将空白作为基本标记来处理，用一个元符号 “▁”（ U+2581 ）转义空白，这样就可以实现简单且可逆的编解码（编解码的可逆性：`Decode (Encode (Normalized (text)))= Normalized (text)`）
>
> * 无须 Pre-tokenization：Sentencepiece 可以直接从 raw text/setences 进行训练，无须 Pre-tokenization
>
> * 快速和轻量化

## Tokenizers 库

编码时的 pipeline，调用 Tokenizer. encode 或 Tokenizer. encode\_batch 时，文本经过了以下过程：

* normalization：清理、删除空格、删除变音符号、小写化、Unicode normalization

```python
from tokenizers import normalizers
from tokenizers. normalizers import NFD, StripAccents, Lowercase
# 定义一个 normalizer
normalizer = normalizers.Sequence ([
    NFD (),          # Unicode 正规化
    StripAccents (), # 去除读音
    Lowercase ()]    # 转小写
)
normalizer. normalize_str ("Héllò hôw are ü?")
# Output: 'hello how are u?'
tokenizer. normalizer = normalizer  # 更新到 tokenizer 里
```

* pre-tokenization：将文本拆分为更小的对象的行为，这些对象给出了训练结束时 token 的上限。考虑这一点的一个好方法是预分词器会将你的文本拆分为“单词”，然后你的最终 token 将是这些单词的一部分。比如以空格进行切分，输出一个 list，各元素均为元组

```python
from tokenizers. pre_tokenizers import Whitespace
pre_tokenizer = Whitespace ()
pre_tokenizer. pre_tokenize_str ("Hello! How are you? I'm fine, thank you.")

# #或者调用多个pre_tokenizers
pre_tokenizer = pre_tokenizers.Sequence ([
    Whitespace (), 
    Digits (individual_digits=True)  # 如果 individual_digits=False，“911”就不会被单独分成数字
])
pre_tokenizer. pre_tokenize_str ("Call 911! How are you? I'm fine thank you")
tokenizer. pre_tokenizer = pre_tokenizer   # 更新到 tokenizer 里
```

* model：具体分词算法，`tokenizer = Tokenizer (BPE (unk_token="[UNK]"))`

* post-processing：& #x540E ; 处理，实现比如加 special token（\[CLS]、\[SEP]）等操作

# 1.1.4 分词方法对比

> * wordpiece 和 BPE 的对比：& #x90FD ; 是走的合并的思路，将语料拆分成最小单元（英文中 26 个字母加上各种符号，这些作为初始词表）然后进行合并，词表从小到大；核心区别就在于 wordpiece 是按 token 间的互信息来进行合并而 BPE 是按照 token 一同出现的频率来合并的
>
> * wordpiece 和 ULM 的对比：& #x90FD ; 使用语言模型来挑选子词；区别在于前者词表由小到大，而后者词表由大到小，先初始化一个大词表，根据评估准则不断丢弃词表，直到满足限定条件。ULM 算法考虑了句子的不同分词可能，因而能够输出带概率的多个分词结果
