export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Painel esquerdo — imagem/branding */}
      <div className="hidden lg:flex relative bg-gradient-to-br from-yellow-500 via-red-600 to-green-600 overflow-hidden">
        {/* Triângulos decorativos — replicam o design da imagem */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-0 h-0
            border-l-[400px] border-l-yellow-500
            border-b-[300px] border-b-transparent" />
          <div className="absolute top-0 right-0 w-0 h-0
            border-r-[350px] border-r-red-600
            border-b-[400px] border-b-transparent" />
          <div className="absolute bottom-0 left-0 w-0 h-0
            border-l-[450px] border-l-green-600
            border-t-[350px] border-t-transparent" />
          <div className="absolute bottom-1/3 left-1/4 w-0 h-0
            border-l-[200px] border-l-red-700
            border-b-[200px] border-b-transparent
            border-t-[200px] border-t-transparent" />
          <div className="absolute top-1/3 right-1/4 w-0 h-0
            border-r-[180px] border-r-yellow-600
            border-b-[250px] border-b-transparent" />
        </div>

        {/* Logo topo esquerdo */}
        <div className="absolute top-8 left-8 flex items-center gap-3 z-10">
          <div className="flex items-center gap-2">
            {/* Placeholder logo ARPE */}
            <div className="w-10 h-10 bg-white rounded flex items-center justify-center">
              <span className="text-red-600 font-black text-xs">ARPE</span>
            </div>
            <div className="w-px h-8 bg-white/40" />
            <div className="text-white">
              <p className="text-xs font-medium leading-tight">Coordenadoria de</p>
              <p className="text-xs font-medium leading-tight">Tecnologia da Informação</p>
            </div>
          </div>
        </div>

        {/* Texto central */}
        <div className="absolute bottom-32 left-8 right-8 z-10">
          <h1 className="text-white font-black text-4xl leading-tight drop-shadow-lg">
            Regulação<br />
            e fiscalização<br />
            de Pernambuco.
          </h1>
          <p className="text-white/80 text-sm mt-4 leading-relaxed max-w-xs">
            Portal de gestão regulatória para servidores autorizados da Agência de Regulação de Pernambuco.
          </p>
        </div>

        {/* Rodapé */}
        <div className="absolute bottom-6 left-8 z-10">
          <p className="text-white/50 text-xs">
            © 2026 ARPE — Agência de Regulação de Pernambuco
          </p>
        </div>
      </div>

      {/* Painel direito — formulário */}
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
          {children}
        </div>
      </div>
    </div>
  )
}