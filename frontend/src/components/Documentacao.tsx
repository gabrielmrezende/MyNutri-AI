export function Documentacao() {
  return (
    <article className="doc">
      <h2 className="doc-title">Documentação e transparência</h2>
      <p className="doc-intro">
        Esta página descreve o que é o MyNutri AI, como ele funciona, como os dados e a
        inteligência artificial são usados, e quais são as limitações da ferramenta.
      </p>

      <section className="doc-section">
        <h3>O que é o MyNutri AI</h3>
        <p>
          O MyNutri AI é uma <strong>plataforma web de apoio informativo</strong> ao
          planejamento alimentar. O objetivo é oferecer sugestões gerais de cardápio e
          orientações educativas para pessoas que não têm acesso fácil a acompanhamento
          nutricional profissional.
        </p>
        <p>
          A ferramenta <strong>não substitui</strong> consultas com nutricionista ou
          médico. Ela serve como apoio educacional e não realiza prescrição dietética
          individualizada nem tratamento de condições de saúde.
        </p>
      </section>

      <section className="doc-section">
        <h3>Como a aplicação funciona</h3>
        <ol className="doc-list doc-list--numbered">
          <li>
            <strong>Anamnese digital</strong> — Você preenche um formulário em etapas
            com dados como: rotina, objetivos (emagrecimento, ganho de massa, saúde
            geral etc.), preferências e restrições alimentares, e informações básicas
            (idade, peso, altura, quando quiser informar).
          </li>
          <li>
            <strong>Envio dos dados</strong> — As respostas são enviadas ao servidor da
            aplicação (backend). Se o backend estiver rodando e configurado com chave
            da OpenAI, os dados são usados para gerar um plano alimentar com apoio de
            IA.
          </li>
          <li>
            <strong>Geração do plano</strong> — Em modo com API: um modelo de linguagem
            (ex.: GPT) recebe sua anamnese e devolve um plano em texto estruturado
            (refeições, horários sugeridos, avisos). Em modo sem API ou quando a
            conexão falha: é exibido um <strong>plano de exemplo fixo</strong>, apenas
            ilustrativo.
          </li>
          <li>
            <strong>Exibição do resultado</strong> — O plano é mostrado na tela em
            formato de cards (café da manhã, almoço, jantar etc.), com avisos de que é
            apenas informativo e não substitui acompanhamento profissional.
          </li>
        </ol>
      </section>

      <section className="doc-section">
        <h3>Uso de inteligência artificial</h3>
        <p>
          Quando o backend está configurado com chave da API da <strong>OpenAI</strong>,
          o plano alimentar é gerado por um modelo de linguagem (por exemplo,
          gpt-4o-mini). O sistema envia à OpenAI apenas o conteúdo da sua anamnese e
          instruções fixas para o modelo (prompt), que definem:
        </p>
        <ul className="doc-list">
          <li>caráter apenas educativo e não clínico;</li>
          <li>recomendação de acompanhamento profissional;</li>
          <li>formato de resposta (ex.: JSON com refeições e avisos);</li>
          <li>orientação para não prescrever dietas para doenças específicas.</li>
        </ul>
        <p>
          Se não houver chave da API ou se a conexão com o backend falhar, a aplicação
          exibe um <strong>plano genérico de exemplo</strong>, sem enviar dados a
          nenhum serviço externo.
        </p>
      </section>

      <section className="doc-section">
        <h3>Dados e privacidade</h3>
        <p>
          Os dados informados na anamnese (rotina, objetivos, preferências, restrições,
          dados antropométricos opcionais) são usados somente para gerar o plano naquele
          momento. Na versão atual (protótipo/MVP):
        </p>
        <ul className="doc-list">
          <li>
            <strong>Com backend rodando</strong> — Os dados são enviados ao servidor da
            aplicação e, se houver integração com OpenAI, à API da OpenAI conforme a
            política de uso e privacidade da OpenAI.
          </li>
          <li>
            <strong>Sem backend / plano de exemplo</strong> — Nenhum dado é enviado a
            servidor externo; o plano exibido é fixo e apenas ilustrativo.
          </li>
        </ul>
        <p>
          Esta ferramenta não utiliza seus dados para treinar modelos. Recomenda-se
          não inserir informações que você não queira que sejam processadas por
          serviços em nuvem quando o backend estiver conectado à API de IA.
        </p>
      </section>

      <section className="doc-section">
        <h3>Limitações e aviso legal</h3>
        <ul className="doc-list">
          <li>
            O MyNutri AI <strong>não substitui</strong> o acompanhamento por
            nutricionista ou médico. Em casos de doenças (diabetes, hipertensão,
            dislipidemias, alergias graves etc.) ou uso de medicamentos, consulte sempre
            um profissional de saúde.
          </li>
          <li>
            A ferramenta não calcula calorias ou macros com precisão clínica e não
            faz prescrição dietética individualizada com finalidade terapêutica.
          </li>
          <li>
            Os planos gerados são <strong>sugestões educativas</strong>. Adapte às suas
            necessidades e, em caso de dúvida, procure um nutricionista.
          </li>
        </ul>
      </section>

      <section className="doc-section">
        <h3>Arquitetura técnica (resumo)</h3>
        <p>
          A aplicação é dividida em <strong>frontend</strong> (interface em React +
          Vite) e <strong>backend</strong> (API em Python com FastAPI). O frontend
          envia a anamnese em JSON para o endpoint <code>/api/gerar-plano</code>. O
          backend valida os dados, opcionalmente chama a API da OpenAI e devolve o
          plano em JSON. Em modo protótipo ou sem conexão, o frontend pode exibir um
          plano de exemplo local, sem chamar o backend.
        </p>
      </section>

      <section className="doc-section doc-section--disclaimer">
        <h3>Aviso final</h3>
        <p>
          Esta ferramenta é apenas informativa e educativa. O uso da aplicação não
          constitui relação profissional de saúde. Para um plano alimentar
          personalizado e seguro, consulte um nutricionista ou médico.
        </p>
      </section>
    </article>
  );
}
