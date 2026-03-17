# Especificação: Editor com Syntax Highlighting

## Decisões

- **Biblioteca**: Shiki (já está no projeto)
- **Line numbers**: Sim
- **Modo**: Único modo editável com highlight em tempo real

## Requisitos Funcionais

### 1. Syntax Highlighting em Tempo Real
- Aplicar cores ao código conforme o usuário digita/cola
- Atualização com debounce (~150ms) para performance

### 2. Detecção Automática de Linguagem
- Detectar linguagem automaticamente ao colar código
- Heurísticas baseadas em padrões (keywords, sintaxe)
- Ativado quando: campo vazio → preenchido OU paste de 50+ caracteres

### 3. Seleção Manual de Linguagem
- Dropdown para selecionar linguagem
- Sobrescreve detecção automática quando selecionada

### 4. Editor Unico
- Área editável com syntax highlighting visível
- Line numbers sincronizados

## Stack Técnica

### Arquitetura: Textarea Overlay

- Shiki para highlighting (createHighlighter + codeToHtml)
- Textarea transparente sobre o código highlightado
- Scroll sincronizado entre textarea e código
- 25 linguagens suportadas

## Linguagens Suportadas

- javascript, typescript, jsx, tsx
- python, java, go, rust
- c, cpp, csharp
- html, css, scss
- sql, json, yaml
- ruby, php, swift, kotlin
- markdown, bash, graphql, dockerfile

## Componentes

### CodeEditor (Client Component)
- Props: `value`, `onChange`, `language`, `onLanguageChange`, `autoDetect`, `className`
- Estado interno: `language`, `highlightedCode`, `highlighter`

## To-Do

- [x] Atualizar `code-editor.tsx` com Shiki
- [x] Implementar highlighting em tempo real
- [x] Adicionar language selector dropdown
- [x] Implementar detecção automática
- [x] Sincronizar line numbers
- [x] Integrar com homepage
