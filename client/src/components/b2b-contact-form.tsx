import { useState } from "react";
import { Building2, User, Phone, Mail, Package, Send } from "lucide-react";

// Número do WhatsApp - SUBSTITUA PELO SEU
const WHATSAPP_NUMBER = "5547988028270";

interface FormData {
    empresa: string;
    nome: string;
    telefone: string;
    email: string;
    quantidade: string;
    mensagem: string;
}

export default function B2BContactForm() {
    const [formData, setFormData] = useState<FormData>({
        empresa: "",
        nome: "",
        telefone: "",
        email: "",
        quantidade: "",
        mensagem: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Monta a mensagem para o WhatsApp
        const message = `*🏢 Solicitação B2B - IPPAX +MAIS*

*Empresa:* ${formData.empresa}
*Nome:* ${formData.nome}
*Telefone:* ${formData.telefone}
*Email:* ${formData.email}
*Quantidade desejada:* ${formData.quantidade}

*Mensagem:*
${formData.mensagem || "Gostaria de mais informações sobre compra em grande quantidade."}`;

        // Codifica a mensagem para URL
        const encodedMessage = encodeURIComponent(message);

        // Abre o WhatsApp com a mensagem
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, "_blank");
    };

    return (
        <section id="b2b" className="py-24 bg-gradient-to-b from-slate-50 to-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left - Info */}
                    <div className="space-y-8">
                        <div>
                            <span className="inline-block bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                                🏢 Atacado & Distribuidores
                            </span>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                                Compra em <span className="text-teal-600">Grande Quantidade?</span>
                            </h2>
                            <p className="text-xl text-slate-600">
                                Condições especiais para revendedores, distribuidores e empresas.
                                Fale diretamente com nosso time comercial.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {[
                                { icon: Package, title: "Preços Exclusivos", desc: "Descontos progressivos por volume" },
                                { icon: Building2, title: "Nota Fiscal", desc: "CNPJ e documentação completa" },
                                { icon: Phone, title: "Atendimento Dedicado", desc: "Suporte personalizado B2B" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                    <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <item.icon className="w-6 h-6 text-teal-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800">{item.title}</h4>
                                        <p className="text-slate-500 text-sm">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right - Form */}
                    <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
                        <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                            </div>
                            Fale com o Comercial
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Empresa *</label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="text"
                                            name="empresa"
                                            value={formData.empresa}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                            placeholder="Nome da empresa"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Nome *</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="text"
                                            name="nome"
                                            value={formData.nome}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                            placeholder="Seu nome"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp *</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="tel"
                                            name="telefone"
                                            value={formData.telefone}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                            placeholder="(00) 00000-0000"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                            placeholder="email@empresa.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Quantidade Desejada *</label>
                                <select
                                    name="quantidade"
                                    value={formData.quantidade}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                >
                                    <option value="">Selecione a quantidade</option>
                                    <option value="10-50 rolos">10 a 50 rolos</option>
                                    <option value="50-100 rolos">50 a 100 rolos</option>
                                    <option value="100-500 rolos">100 a 500 rolos</option>
                                    <option value="500+ rolos">Mais de 500 rolos</option>
                                    <option value="Container">Container completo</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Mensagem (opcional)</label>
                                <textarea
                                    name="mensagem"
                                    value={formData.mensagem}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                                    placeholder="Conte-nos mais sobre sua necessidade..."
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-colors shadow-lg shadow-green-500/30"
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                Enviar via WhatsApp
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
