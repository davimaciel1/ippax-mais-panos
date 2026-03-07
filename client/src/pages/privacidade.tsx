import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export default function Privacidade() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">
            Política de Privacidade
          </h1>
          <p className="text-sm text-slate-500 mb-10">
            Última atualização: 07 de março de 2026
          </p>

          <div className="prose prose-slate max-w-none space-y-8 text-slate-700 leading-relaxed">

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">1. Identificação do Controlador</h2>
              <p>
                <strong>CONNECT TRADES IMPORTAÇÃO E EXPORTAÇÃO LTDA</strong><br />
                CNPJ: 50.891.566/0001-29<br />
                Rua Doutor Pedro Ferreira, 155 — Sala 01402 A Box 88, Centro<br />
                Itajaí — SC, CEP 88301-030<br />
                E-mail para assuntos de privacidade: <a href="mailto:davi@ippax.com" className="text-teal-600 underline">davi@ippax.com</a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">2. Dados que Coletamos</h2>
              <p>Coletamos dados pessoais nas seguintes situações:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>
                  <strong>Navegação no site:</strong> dados de uso anônimos (páginas visitadas, tempo de permanência, origem do acesso) via cookies e ferramentas de análise (Google Analytics, Meta Pixel, TikTok Pixel).
                </li>
                <li>
                  <strong>Formulário de contato B2B:</strong> nome, empresa, telefone, e-mail e quantidade desejada, fornecidos voluntariamente para contato comercial.
                </li>
                <li>
                  <strong>Cadastro de ofertas (opt-in):</strong> e-mail e/ou número de WhatsApp, para envio de promoções e novidades.
                </li>
                <li>
                  <strong>Mensagens RCS:</strong> número de telefone celular, utilizado para envio de comunicações promocionais via RCS (Rich Communication Services) através da plataforma YupChat.
                </li>
                <li>
                  <strong>Parâmetros de campanha (UTM):</strong> dados de atribuição de marketing presentes na URL, sem identificação pessoal direta.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">3. Finalidade do Tratamento</h2>
              <p>Os dados pessoais são tratados para as seguintes finalidades:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Envio de ofertas, promoções e novidades dos produtos IPPAX +MAIS;</li>
                <li>Comunicação comercial via WhatsApp e RCS;</li>
                <li>Atendimento a solicitações de compra no atacado (B2B);</li>
                <li>Análise de desempenho do site e campanhas de marketing;</li>
                <li>Direcionamento para compra nos marketplaces parceiros (Amazon, Shopee, Mercado Livre);</li>
                <li>Cumprimento de obrigações legais e regulatórias.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">4. Base Legal (LGPD)</h2>
              <p>O tratamento de dados pessoais se fundamenta nas seguintes bases legais previstas na Lei nº 13.709/2018 (LGPD):</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li><strong>Consentimento (Art. 7º, I):</strong> para envio de comunicações de marketing via e-mail, WhatsApp e RCS.</li>
                <li><strong>Legítimo interesse (Art. 7º, IX):</strong> para análise de navegação e melhoria dos serviços.</li>
                <li><strong>Execução de contrato (Art. 7º, V):</strong> para atendimento de solicitações comerciais B2B.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">5. Compartilhamento de Dados</h2>
              <p>Seus dados podem ser compartilhados com:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li><strong>Plataformas de análise:</strong> Google Analytics, Meta (Facebook/Instagram), TikTok — dados anonimizados de navegação.</li>
                <li><strong>Plataforma de RCS:</strong> YupChat — número de telefone para envio de mensagens RCS.</li>
                <li><strong>Marketplaces:</strong> ao clicar nos links de compra, você é redirecionado para Amazon, Shopee ou Mercado Livre, que possuem suas próprias políticas de privacidade.</li>
              </ul>
              <p className="mt-2">Não vendemos, alugamos ou cedemos seus dados pessoais a terceiros para finalidades não descritas nesta política.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">6. Cookies</h2>
              <p>
                Utilizamos cookies e tecnologias similares para melhorar sua experiência de navegação, medir o desempenho do site e personalizar conteúdo. Os cookies utilizados incluem:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li><strong>Essenciais:</strong> necessários para o funcionamento básico do site.</li>
                <li><strong>Analíticos:</strong> Google Analytics — métricas de uso e desempenho.</li>
                <li><strong>Marketing:</strong> Meta Pixel, TikTok Pixel — rastreamento de conversão e remarketing.</li>
              </ul>
              <p className="mt-2">Você pode desabilitar cookies nas configurações do seu navegador, mas isso pode afetar a funcionalidade do site.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">7. Retenção de Dados</h2>
              <p>
                Os dados pessoais são mantidos pelo tempo necessário para cumprir as finalidades para as quais foram coletados, respeitando os prazos legais aplicáveis. Dados de marketing são mantidos até a revogação do consentimento pelo titular.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">8. Seus Direitos (LGPD)</h2>
              <p>Como titular de dados pessoais, você tem direito a:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Confirmar a existência de tratamento de seus dados;</li>
                <li>Acessar seus dados pessoais;</li>
                <li>Corrigir dados incompletos, inexatos ou desatualizados;</li>
                <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários;</li>
                <li>Solicitar a portabilidade dos dados;</li>
                <li>Revogar o consentimento a qualquer momento;</li>
                <li>Solicitar a eliminação dos dados tratados com base no consentimento.</li>
              </ul>
              <p className="mt-2">
                Para exercer seus direitos, entre em contato pelo e-mail{" "}
                <a href="mailto:davi@ippax.com" className="text-teal-600 underline">davi@ippax.com</a>{" "}
                ou pelo WhatsApp{" "}
                <a href="https://wa.me/5547988028270" className="text-teal-600 underline">(47) 98802-8270</a>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">9. Comunicações RCS</h2>
              <p>
                Ao fornecer seu número de telefone e consentir com o recebimento de mensagens, você poderá receber comunicações promocionais via RCS (Rich Communication Services). Essas mensagens podem incluir ofertas de produtos, descontos exclusivos e links para compra nos marketplaces.
              </p>
              <p className="mt-2">
                Você pode cancelar o recebimento de mensagens RCS a qualquer momento respondendo "SAIR" à mensagem recebida ou entrando em contato conosco.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">10. Segurança</h2>
              <p>
                Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados pessoais contra acessos não autorizados, perda, alteração ou destruição. Nosso site utiliza certificado SSL (HTTPS) para proteger a transmissão de dados.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">11. Alterações nesta Política</h2>
              <p>
                Esta política pode ser atualizada periodicamente. Recomendamos que consulte esta página regularmente. A data da última atualização está indicada no topo do documento.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">12. Contato</h2>
              <p>
                Para dúvidas, solicitações ou reclamações relacionadas a esta política de privacidade ou ao tratamento de seus dados pessoais:
              </p>
              <p className="mt-2">
                <strong>CONNECT TRADES IMPORTAÇÃO E EXPORTAÇÃO LTDA</strong><br />
                E-mail: <a href="mailto:davi@ippax.com" className="text-teal-600 underline">davi@ippax.com</a><br />
                WhatsApp: <a href="https://wa.me/5547988028270" className="text-teal-600 underline">(47) 98802-8270</a><br />
                Endereço: Rua Doutor Pedro Ferreira, 155 — Sala 01402 A Box 88, Centro — Itajaí/SC
              </p>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
