# 📄 Sistema de Gestão de Ofícios

Um sistema centralizado para criar, gerenciar e acompanhar ofícios institucionais de forma simples e organizada.

---

## 🎯 O que é o Sistema?

Este sistema foi desenvolvido para facilitar o gerenciamento de ofícios institucionais, centralizando todo o processo em um único lugar.

Seu objetivo principal é:

- Criar ofícios de forma padronizada
- Gerenciar e acompanhar o envio
- Organizar contatos e responsáveis
- Manter histórico e rastreabilidade
- Facilitar comunicação entre departamentos

---

## 🏠 Primeira Tela - Listagem de Ofícios

Após fazer login, você é direcionado para a **Tela de Ofícios**, que é a tela principal do sistema.

Esta é a tela que mais você usará, pois aqui você:

- Visualiza todos os seus ofícios
- Cria novos ofícios
- Edita ofícios existentes
- Acompanha o status de cada um
- Realiza ações como editar e avaliar

### 📋 O que você vê nesta tela

**Lista de Ofícios:**

- Número do ofício
- Assunto
- Status (Rascunho, Pendente, Aprovado, Enviado)
- Prioridade (Normal, Baixa, Alta, Urgente)
- Responsáveis
- Data de criação

**Ações disponíveis:**

- **Editar**: Modifique ofícios em rascunho ou pendentes
- **Visualizar**: Veja detalhes completos
- **Avaliar**: Dê feedback sobre o ofício
- **Download PDF**: Salve em PDF

### 🔍 Filtros e Busca

Use os filtros para encontrar ofícios rapidamente:

- **Por Status**: Rascunho, Pendente, Aprovado, Enviado
- **Por Data**: Busque por período
- **Por Departamento**: Se configurado
- **Busca por Texto**: Número ou assunto do ofício

---

## ✨ Criando um Novo Ofício

Clique em **"Novo Ofício"** para abrir o formulário de criação. O processo é dividido em etapas:

### **Etapa 1: Informações Básicas**

Preencha:

- **Assunto**: O tema principal do ofício
- **Prioridade**:
  - Normal (padrão)
  - Baixa
  - Alta
  - Urgente

### **Etapa 2: Destinatários**

- **Selecionar Contato**: Busque e escolha quem receberá o ofício
- **Responsáveis**: Defina as pessoas responsáveis por cada destinatário
  - Você pode adicionar múltiplos responsáveis

### **Etapa 3: Conteúdo do Ofício**

Escolha uma das opções:

- **Usar Template**: Selecione um modelo pronto (mais rápido para ofícios recorrentes)
- **Editar Livre**: Escreva o conteúdo do zero usando o editor de texto rico

O editor permite:

- Formatação de texto (negrito, itálico, sublinhado)
- Alinhamento (esquerda, centro, direita)
- Listas numeradas e com marcadores
- Outras opções de formatação

### **Etapa 4: Preview (Visualização)**

Antes de enviar, você vê exatamente como o ofício ficará:

- Visualiza o layout completo
- Verifica as informações
- Faz correções se necessário

### **Etapa 5: Envio**

Duas opções:

- **Salvar como Rascunho**: Guardar para editar depois
- **Enviar**: Enviar o ofício para aprovação

---

## ✏️ Editando um Ofício

Apenas ofícios nos status **Rascunho** ou **Pendente** podem ser editados.

Para editar:

1. Localize o ofício na lista
2. Clique em **"Editar"**
3. Faça as alterações necessárias
4. Salve as mudanças

---

## 👁️ Visualizando Detalhes de um Ofício

Clique em um ofício para ver:

- Informações completas
- Autor e data de criação
- Destinatários e responsáveis
- Histórico de mensagens/comentários
- Status atual
- Todas as ações realizadas

---

## 📦 Arquivando Ofícios

Quando um ofício já foi concluído ou não é mais necessário:

1. Localize o ofício
2. Clique em **"Arquivar"**
3. O ofício sai da lista principal (mas continua acessível se necessário)

---

## 👥 Módulo de Contatos

Acesse pela barra lateral: **Contatos**

Aqui você gerencia todos os contatos que podem receber ofícios.

### 📞 Listagem de Contatos

Visualize todos os contatos cadastrados:

- **Buscar** por nome
- **Filtrar** por departamento
- Ver informações básicas (nome, tipo, departamento, responsável)

### ➕ Adicionando um Contato

Clique em **"Novo Contato"** e preencha:

- **Nome**: Nome do contato/departamento
- **Tipo**: Classificação do contato
- **Departamento**: Departamento responsável
- **Responsável**: Pessoa de contato
- **Endereço**: Informações adicionais

Após preencher, clique em **"Salvar"** e o contato aparece na lista.

### ✏️ Editando um Contato

1. Selecione o contato na lista
2. Clique em **"Editar"**
3. Modifique as informações necessárias
4. Salve as mudanças

### 🗑️ Removendo um Contato

1. Selecione o contato
2. Clique em **"Deletar"**
3. Confirme a ação
4. O contato é removido do sistema

---

## 📨 Caixa de Saída

Acesse pela barra lateral: **Caixa de Saída**

Local para acompanhar ofícios que você enviou.

**O que você encontra:**

- Lista de ofícios enviados
- Status de cada um
- Histórico de ações
- Feedback e avaliações recebidas

Aqui você consegue acompanhar o progresso de cada ofício após o envio.

---

## ⚙️ Administração - Módulo Cadastro

_Apenas usuários com permissão de administrador veem estas opções_

Acesse pela barra lateral: **Cadastro** (expande um submenu)

### 👤 Gerenciamento de Usuários → "Usuários"

Gerencie todos os usuários do sistema.

**Funcionalidades:**

- **Listar** todos os usuários
- **Adicionar** novo usuário (preencher nome, email, definir permissões)
- **Editar** informações de um usuário
- **Ativar/Desativar** usuário
- **Deletar** usuário

### 🎭 Papéis e Permissões → "Papéis"

Configure quem pode fazer o quê no sistema.

**Papéis disponíveis:**

- **Admin**: Acesso total a todos os módulos
- **Gerente**: Acesso a gerenciamento e ofícios
- **Usuário**: Acesso apenas aos ofícios e contatos

Cada papel tem permissões específicas definidas.

### 💼 Cargos → "Cargos"

Mantenha a lista de cargos disponíveis no sistema.

**Ações:**

- **Visualizar** todos os cargos
- **Adicionar** novo cargo
- **Editar** cargo existente
- **Remover** cargo

### 📝 Templates de Ofício → "Templates"

Crie modelos reutilizáveis para agilizar o processo.

**Como funciona:**

1. Clique em **"Novo Template"**
2. Defina um nome e descrição
3. Escreva o conteúdo do template (pode usar o mesmo editor dos ofícios)
4. Salve

Depois, ao criar um novo ofício, você pode:

- Selecionar um template
- O conteúdo é preenchido automaticamente
- Você só ajusta o que precisa mudar

### 📧 Configurações → "Configurações"

Configure o servidor de email para envio de ofícios.

**O que configurar:**

- Host do servidor
- Porta
- Usuário/Senha
- Endereço de origem (sender)

Sem isso, os ofícios não são enviados por email.

---

## 👤 Perfil do Usuário

Clique no seu nome/avatar no **menu superior (Header)** para acessar seu perfil.

**O que fazer:**

- Visualizar dados pessoais
- Editar informações (nome, email)
- Trocar senha
- Visualizar nível de acesso

---

## 🚪 Logout

Para sair do sistema:

1. Clique no seu perfil (menu superior)
2. Clique em **"Sair"** ou **"Logout"**
3. Você é desconectado com segurança

---

## 🔄 Como as Telas se Conversam

### Usuário Comum - Fluxo Típico

```
Login
  ↓
Ofícios (Tela Principal)
  ├→ Novo Ofício
  │   ├→ Preencher informações
  │   ├→ Selecionar Contato
  │   ├→ Escrever conteúdo
  │   ├→ Preview
  │   └→ Enviar
  │
  ├→ Editar ofício
  │
  ├→ Visualizar detalhes
  │
  ├→ Arquivar
  │
  ├→ Contatos
  │   ├→ Buscar contato
  │   ├→ Adicionar contato
  │   ├→ Editar contato
  │   └→ Remover contato
  │
  ├→ Caixa de Saída
  │   ├→ Acompanhar enviados
  │   └→ Ver feedback
  │
  ├→ Perfil
  │   ├→ Ver informações
  │   ├→ Editar dados
  │   └→ Trocar senha
  │
  └→ Logout
```

### Administrador - Fluxo Completo

Tem acesso a tudo do usuário comum, mais:

```
Ofícios (Tela Principal)
  ├→ [Fluxo do usuário comum acima]
  │
  └→ Cadastro (submenu)
      ├→ Usuários
      │   ├→ Listar
      │   ├→ Adicionar
      │   ├→ Editar
      │   └→ Deletar
      │
      ├→ Papéis
      │   └→ Configurar permissões
      │
      ├→ Cargos
      │   ├→ Listar
      │   ├→ Adicionar
      │   ├→ Editar
      │   └→ Deletar
      │
      ├→ Templates
      │   ├→ Criar template
      │   ├→ Editar
      │   └→ Deletar
      │
      └→ Configurações
          └→ SMTP
```

---

## 💡 Dicas de Uso

### ✅ Boas Práticas

- **Rascunho Primeiro**: Sempre comece salvando como rascunho. Isso permite fazer alterações antes de enviar de verdade.

- **Use Templates**: Se você cria ofícios similares com frequência, crie um template. Isso economiza muito tempo.

- **Filtros e Busca**: Use os filtros da listagem para encontrar ofícios rapidamente. Filtrar por status é especialmente útil.

- **Defina Prioridade Corretamente**: Escolha a prioridade de acordo com a urgência. Assim fica claro para os responsáveis.

- **Indique Responsáveis**: Sempre deixe claro quem é responsável por cada destinatário. Isso evita confusões.

- **Revise no Preview**: Antes de enviar, revise bem o ofício no preview. Erros nessa etapa são fáceis de corrigir.

### ⏱️ Fluxo Rápido

Para criar um ofício rápido:

1. Novo Ofício
2. Preencha informações básicas
3. Selecione um template
4. Escolha destinatário e responsáveis
5. Preview
6. Enviar

Leva menos de 2 minutos!

### 📊 Acompanhamento

Para saber como está um ofício:

- Vá para **"Ofícios"** (já é a tela padrão)
- Filtre por status
- Clique no ofício para ver detalhes
- Confira o histórico de ações

---

## ❓ Dúvidas Comuns

### "O ofício não foi enviado. O que fazer?"

Verifique:

- Status: Está em "Enviado"? Se estiver em "Rascunho", clique em editar e depois enviar.
- Destinatário: Tem certeza que selecionou um contato válido?
- Configuração SMTP: Se você é admin, verifique se SMTP está configurado.

### "Não consigo editar um ofício"

Razão provável: O ofício já foi aprovado ou enviado. Apenas ofícios em Rascunho ou Pendente podem ser editados.

Solução: Se realmente precisa mudar, crie um novo ofício com as informações corretas.

### "Como recuperar um ofício arquivado?"

Infelizmente, não há opção de "desarquivar" no fluxo atual. Se precisar recuperar informações, crie um novo ofício com os dados necessários.

### "Posso usar um template de outro usuário?"

Sim! Os templates são compartilhados entre todos os usuários. Qualquer um pode usar qualquer template disponível.

### "Como adicionar mais responsáveis?"

Na etapa de seleção de responsáveis, clique em **"Adicionar Responsável"** para cada um que precisar adicionar.

### "Esqueci minha senha"

Na tela de login, clique em **"Esqueceu a Senha?"** e siga as instruções enviadas por email.

### "Não consigo visualizar determinada funcionalidade"

Alguns recursos dependem das permissões do usuário. Caso necessário, solicite acesso ao administrador do sistema.

---

## 📞 Suporte

Se encontrar algum problema ou tiver dúvidas não listadas aqui:

- Contate o administrador do sistema
- Relate o problema descrevendo:
  - O que estava fazendo
  - Qual erro ocorreu
  - Quando o problema começou

---

## 📋 Resumo Rápido

| Ação                | Onde?                              | Como?                        |
| ------------------- | ---------------------------------- | ---------------------------- |
| Criar ofício        | Ofícios → Novo Ofício              | Preencha formulário e envie  |
| Encontrar ofício    | Ofícios                            | Use filtros ou busca         |
| Editar ofício       | Ofícios → Editar                   | Rascunhos e Pendentes apenas |
| Ver contatos        | Contatos                           | Lista com busca e filtro     |
| Acompanhar enviados | Caixa de Saída                     | Vê status e feedback         |
| Gerenciar usuários  | Cadastro → Usuários                | Admin apenas                 |
| Criar template      | Cadastro → Templates               | Define modelo reutilizável   |
| Ver/Editar perfil   | Clique no seu nome (menu superior) | Seus dados pessoais          |
| Sair                | Clique no seu nome → Logout        | Desconectar                  |

---

**Versão:** 1.0  
**Última atualização:** Junho de 2026

Aproveite o sistema! 🚀
