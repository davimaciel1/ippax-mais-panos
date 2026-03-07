import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export default function Termos() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">
            Termos de Serviço
          </h1>
          <p className="text-sm text-slate-500 mb-10">
            Última atualização: 07 de março de 2026
          </p>

          <div className="prose prose-slate max-w-none space-y-8 text-slate-700 leading-relaxed">

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">1. Identificação</h2>
              <p>
                Este site é operado por <strong>CONNECT TRADES IMPORTAÇÃO E EXPORTAÇÃO LTDA</strong>,
                inscrita no CNPJ sob o nº 50.891.566/0001-29, com sede na Rua Doutor Pedro Ferreira, 155 —
                Sala 01402 A Box 88, Centro, Itajaí — SC, CEP 88301-030, sob a marca comercial <strong>IPPAX +MAIS</strong>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">2. Objeto</h2>
              <p>
                O site <strong>ippaxmais.com.br</strong> tem como objetivo apresentar os produtos da marca IPPAX +MAIS
                (panos multiuso de alta absorção) e direcionar o consumidor para compra nos marketplaces parceiros
                (Amazon, Shopee, Mercado Livre e TikTok Shop).
              </p>
              <p className="mt-2">
                O site é um canal informativo e promocional. As transações de compra e venda são realizadas
                exclusivamente nos marketplaces indicados, sendo regidas pelos termos de cada plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">3. Links de Afiliado</h2>
              <p>
                Os links de compra presentes neste site podem ser links de afiliado. Isso significa que, ao clicar
                e realizar uma compra no marketplace, poderemos receber uma comissão pela indicação, sem qualquer
                custo adicional para o consumidor.
              </p>
              <p className="mt-2">
                Os preços, condições de pagamento, frete e prazos de entrega são definidos pelo marketplace
                onde a compra é realizada, e não pela IPPAX +MAIS ou Connect Trades.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">4. Comunicações (RCS, WhatsApp e E-mail)</h2>
              <p>
                Ao fornecer seu número de telefone ou e-mail e consentir com o recebimento de comunicações,
                você concorda em receber mensagens promocionais da IPPAX +MAIS pelos seguintes canais:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li><strong>RCS (Rich Communication Services):</strong> mensagens ricas com imagens, botões e links de compra, enviadas via operadora.</li>
                <li><strong>WhatsApp:</strong> mensagens sobre ofertas e promoções.</li>
                <li><strong>E-mail:</strong> newsletters com novidades e descontos exclusivos.</li>
              </ul>
              <p className="mt-2">
                Você pode cancelar o recebimento a qualquer momento:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>RCS: responda "SAIR" à mensagem;</li>
                <li>WhatsApp: envie "SAIR" para nosso número;</li>
                <li>E-mail: clique no link de descadastramento no rodapé.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">5. Propriedade Intelectual</h2>
              <p>
                Todo o conteúdo deste site — incluindo textos, imagens, logotipos, layout, código-fonte e design —
                é de propriedade da Connect Trades ou licenciado para uso. É proibida a reprodução, distribuição
                ou utilização sem autorização prévia por escrito.
              </p>
              <p className="mt-2">
                A marca IPPAX +MAIS, logotipos e identidade visual são de propriedade exclusiva da Connect Trades
                Importação e Exportação LTDA.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">6. Responsabilidades e Limitações</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  A IPPAX +MAIS não se responsabiliza por problemas de estoque, entrega, pagamento ou
                  atendimento pós-venda nos marketplaces parceiros. Para essas questões, o consumidor deve
                  entrar em contato diretamente com o marketplace.
                </li>
                <li>
                  O site é fornecido "como está", sem garantias de disponibilidade ininterrupta.
                  Nos reservamos o direito de realizar manutenções sem aviso prévio.
                </li>
                <li>
                  Não nos responsabilizamos por danos indiretos decorrentes do uso do site ou das informações
                  nele contidas.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">7. Vendas no Atacado (B2B)</h2>
              <p>
                Solicitações de compra em grande quantidade (atacado) realizadas através do formulário B2B
                deste site serão tratadas individualmente pela equipe comercial da Connect Trades.
                Condições comerciais (preço, prazo, frete) serão definidas caso a caso e formalizadas
                por meio de proposta comercial ou contrato específico.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">8. Privacidade</h2>
              <p>
                O tratamento de dados pessoais é regido pela nossa{" "}
                <a href="/privacidade" className="text-teal-600 underline">Política de Privacidade</a>,
                que é parte integrante destes Termos de Serviço.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">9. Alterações</h2>
              <p>
                Reservamo-nos o direito de alterar estes Termos de Serviço a qualquer momento.
                As alterações entram em vigor na data de sua publicação nesta página.
                Recomendamos que consulte esta página periodicamente.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">10. Legislação Aplicável</h2>
              <p>
                Estes Termos são regidos pela legislação brasileira, em especial o Código de Defesa do
                Consumidor (Lei nº 8.078/1990), o Marco Civil da Internet (Lei nº 12.965/2014) e a
                Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
              </p>
              <p className="mt-2">
                Fica eleito o foro da Comarca de Itajaí — SC para dirimir quaisquer controvérsias
                decorrentes destes termos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-3">11. Contato</h2>
              <p>
                Para dúvidas ou esclarecimentos sobre estes termos:
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
