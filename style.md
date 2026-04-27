Instagram Dark UI (Rework Visual)
📌 Objetivo

Recriar o visual do sistema para ficar o mais próximo possível da interface do Instagram (modo dark).

⚠️ Importante:

O projeto já está funcional
O foco é 100% visual (UI/UX)
NÃO alterar lógica, apenas estrutura visual e classes
🎨 Diretrizes Visuais
🌑 Cores (obrigatório seguir)
--bg-main: #000000;
--bg-secondary: #121212;
--border: #262626;

--text-primary: #f5f5f5;
--text-secondary: #a8a8a8;

--accent: #0095f6;

❌ Não usar:

Preto absoluto em tudo sem variação
Cinzas aleatórios
Sombras pesadas
🔤 Tipografia

Usar:

font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

Hierarquia:

Username: font-weight: 600
Texto normal: 400
Texto secundário: cor cinza + menor destaque
🧱 Layout
Estrutura obrigatória:
[ Sidebar ] [ Feed ] [ Sugestões ]
Regras:
Feed centralizado
Largura máxima do feed: 470px – 600px
Sidebar fixa (desktop)
Mobile: apenas feed
🧾 Post (Elemento principal)

Cada post DEVE conter:

Header (avatar + username)
Imagem
Ações (like, comentar, compartilhar, salvar)
Likes
Descrição
Comentários
Estilo:
Fundo: preto (#000)
Borda: 1px sólida (#262626)
Sem sombra
Espaçamento interno consistente
🧩 Ícones

Usar ícones estilo outline (ex: Lucide)

Estados:

Normal: branco
Ativo (like): vermelho
Hover: leve opacidade
✨ Microinterações

Obrigatório implementar:

Like:
Escala ao clicar
transform: scale(1.2);
transition: 0.2s;
Hover:
opacity: 0.7;
transition: 0.2s;
📏 Espaçamento

Sistema fixo:

4px / 8px / 12px / 16px / 24px / 32px

❌ Não usar valores aleatórios tipo 13px, 22px, etc.

🚫 O que NÃO fazer
NÃO usar estilo padrão do Bootstrap
NÃO usar bordas arredondadas exageradas
NÃO usar cores fora da paleta
NÃO adicionar sombras pesadas
NÃO poluir a interface
🖼️ Referência Visual

Use como base:

Feed do Instagram
Espaçamento minimalista
Interface limpa e centrada

Sugestões de busca para referência:

"Instagram dark UI feed"
"Instagram desktop layout dark"
"Instagram post UI breakdown"
🧠 Comportamento esperado da IA

A IA deve:

Ajustar componentes para parecerem posts reais
Ajustar aparência padrão do Bootstrap PARA ficar mais proximo ao instagram
Melhorar alinhamento e espaçamento
Aplicar consistência visual global
🧪 Resultado esperado

O sistema deve parecer:

✔ Profissional
✔ Minimalista
✔ Idêntico ao Instagram
✔ Sem aparência de template pronto