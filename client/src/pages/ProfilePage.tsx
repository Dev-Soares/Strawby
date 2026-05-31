import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Sun,
  Moon,
  Monitor,
  SignOut,
  Question,
  FileText,
  ShieldCheck,
  CaretRight,
  EnvelopeSimple,
  Calendar,
  PencilSimple,
  Scales,
  ArrowsVertical,
  GenderMale,
  GenderFemale,
  PlusCircle,
  Password,
  UserCirclePlus,
  UserCircleMinus,
  Stethoscope,
} from '@phosphor-icons/react'
import AppLayout from '@/shared/layouts/AppLayout'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { useSignOut } from '@/modules/auth/hooks/useSignOut'
import { useUpdateUser } from '@/modules/auth/hooks/useUpdateUser'
import { useThemeContext } from '@/shared/contexts/ThemeProvider'
import type { ThemePreference } from '@/shared/hooks/useTheme'
import PatientBodyEditModal from '@/modules/auth/components/PatientBodyEditModal'
import { useGetNutritionist } from '@/modules/nutritionist/hooks/useGetNutritionist'
import { useUpdateCode } from '@/modules/nutritionist/hooks/useUpdateCode'
import UpdateCodeModal from '@/modules/nutritionist/components/UpdateCodeModal'
import AddNutritionistModal from '@/modules/connection-request/components/AddNutritionistModal'
import { useMakeConnectionRequest } from '@/modules/connection-request/hooks/useMakeConnectionRequest'
import { useDisconnectNutritionist } from '@/modules/nutritionist/hooks/useDisconnectNutritionist'
import ConfirmDeleteModal from '@/shared/components/ConfirmDeleteModal'

function getInitials(name: string) {
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const themeOptions: { value: ThemePreference; label: string; Icon: typeof Sun }[] = [
  { value: 'light', label: 'Claro', Icon: Sun },
  { value: 'dark', label: 'Escuro', Icon: Moon },
  { value: 'system', label: 'Sistema', Icon: Monitor },
]

const GENDER_LABEL: Record<string, { label: string; Icon: typeof GenderMale }> = {
  male: { label: 'Masculino', Icon: GenderMale },
  female: { label: 'Feminino', Icon: GenderFemale },
}

export default function ProfilePage() {
  const { data: user } = useAuth()
  const signOut = useSignOut()
  const updateUser = useUpdateUser()
  const { theme, setTheme } = useThemeContext()
  const navigate = useNavigate()
  const [bodyEditOpen, setBodyEditOpen] = useState(false)
  const [codeModalOpen, setCodeModalOpen] = useState(false)
  const [addNutritionistOpen, setAddNutritionistOpen] = useState(false)
  const [confirmDisconnectOpen, setConfirmDisconnectOpen] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [nameValue, setNameValue] = useState('')

  const isNutritionist = user?.role === 'nutritionist'
  const isPatient = user?.role === 'patient'

  const { data: nutritionist } = useGetNutritionist()
  const updateCodeMutation = useUpdateCode()
  const makeRequestMutation = useMakeConnectionRequest()
  const disconnectMutation = useDisconnectNutritionist()

  const initials = user?.name ? getInitials(user.name) : '?'
  const patient = user?.patient ?? null

  const hasBodyData = patient && (patient.weight !== null || patient.height !== null || patient.age !== null || patient.gender !== null)

  return (
    <AppLayout>
      <div className="px-4 sm:px-10 lg:px-16 pt-10 pb-32 max-w-2xl mx-auto">

        {/* Avatar hero */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-24 h-24 rounded-full bg-red-600 flex items-center justify-center mb-4 shadow-lg">
            <span className="font-display text-3xl font-extrabold text-white tracking-tight">
              {initials}
            </span>
          </div>

          <h1 className="font-display text-2xl font-extrabold text-neutral-950 dark:text-neutral-100 tracking-tight mt-1">
            {user?.name ?? '—'}
          </h1>
        </div>

        {/* Conta */}
        <section className="mb-5">
          <p className="text-xs font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2 px-1">
            Conta
          </p>
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden transition-colors duration-300">

            {/* Nome editável */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
              <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                <PencilSimple size={15} weight="bold" className="text-neutral-500 dark:text-neutral-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-0.5">Nome</p>
                {editingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      autoFocus
                      value={nameValue}
                      onChange={(e) => setNameValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && nameValue.trim().length >= 2)
                          updateUser.mutate({ name: nameValue.trim() }, { onSuccess: () => setEditingName(false) })
                        if (e.key === 'Escape') setEditingName(false)
                      }}
                      className="flex-1 min-w-0 text-sm font-semibold text-neutral-800 dark:text-neutral-100 bg-transparent border-b border-red-500 outline-none pb-0.5"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (nameValue.trim().length >= 2)
                          updateUser.mutate({ name: nameValue.trim() }, { onSuccess: () => setEditingName(false) })
                      }}
                      disabled={updateUser.isPending || nameValue.trim().length < 2}
                      className="text-[11px] font-bold text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg disabled:opacity-40 transition-colors cursor-pointer shrink-0"
                    >
                      {updateUser.isPending ? '…' : 'Salvar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingName(false)}
                      className="text-[11px] font-bold text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors cursor-pointer shrink-0"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => { setNameValue(user?.name ?? ''); setEditingName(true) }}
                    className="group flex items-center gap-2 w-full cursor-pointer text-left"
                  >
                    <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 flex-1 min-w-0 truncate">
                      {user?.name ?? '—'}
                    </span>
                    <PencilSimple size={12} weight="bold" className="text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
              <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                <EnvelopeSimple size={15} weight="bold" className="text-neutral-500 dark:text-neutral-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">E-mail</p>
                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 truncate">{user?.email ?? '—'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-5 py-4">
              <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                <Calendar size={15} weight="bold" className="text-neutral-500 dark:text-neutral-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Membro desde</p>
                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                  {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Código de convite (nutritionist only) */}
        {isNutritionist && (
          <section className="mb-5">
            <div className="flex items-center justify-between mb-2 px-1">
              <p className="text-xs font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
                Código de convite
              </p>
              <button
                type="button"
                onClick={() => setCodeModalOpen(true)}
                className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors cursor-pointer"
              >
                <PencilSimple size={12} weight="bold" />
                Editar
              </button>
            </div>
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden transition-colors duration-300">
              <button
                type="button"
                onClick={() => setCodeModalOpen(true)}
                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors duration-200 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                  <Password size={15} weight="bold" className="text-neutral-500 dark:text-neutral-400" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Código atual</p>
                  <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 truncate">
                    {nutritionist?.code ?? 'Não definido'}
                  </p>
                </div>
                <CaretRight size={14} weight="bold" className="text-neutral-400 dark:text-neutral-600 shrink-0" />
              </button>
            </div>
          </section>
        )}

        {/* Nutricionista (patient only) */}
        {isPatient && (
          <section className="mb-5">
            <div className="flex items-center justify-between mb-2 px-1">
              <p className="text-xs font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
                Nutricionista
              </p>
            </div>
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden transition-colors duration-300">
              {patient?.nutritionistId ? (
                <>
                  <div className="flex items-center gap-3 px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
                    <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/30 flex items-center justify-center shrink-0">
                      <Stethoscope size={15} weight="bold" className="text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Nutricionista atual</p>
                      <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 truncate">
                        {patient.nutritionist?.user.name ?? '—'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setConfirmDisconnectOpen(true)}
                    disabled={disconnectMutation.isPending}
                    className="w-full flex items-center gap-3 px-5 py-4 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 group-hover:bg-red-100 dark:group-hover:bg-red-950/40 flex items-center justify-center shrink-0 transition-colors duration-200">
                      <UserCircleMinus size={15} weight="bold" className="text-neutral-500 dark:text-neutral-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-200" />
                    </div>
                    <span className="flex-1 text-sm font-semibold text-neutral-500 dark:text-neutral-400 group-hover:text-red-600 dark:group-hover:text-red-400 text-left transition-colors duration-200">
                      {disconnectMutation.isPending ? 'Removendo…' : 'Remover nutricionista'}
                    </span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setAddNutritionistOpen(true)}
                  className="w-full flex items-center gap-3 px-5 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors duration-200 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                    <UserCirclePlus size={15} weight="bold" className="text-neutral-500 dark:text-neutral-400" />
                  </div>
                  <span className="flex-1 text-sm font-semibold text-neutral-500 dark:text-neutral-400 text-left">
                    Adicionar nutricionista
                  </span>
                  <CaretRight size={14} weight="bold" className="text-neutral-400 dark:text-neutral-600 shrink-0" />
                </button>
              )}
            </div>
          </section>
        )}

        {/* Dados corporais (patient only) */}
        {isPatient && (
          <section className="mb-5">
            <div className="flex items-center justify-between mb-2 px-1">
              <p className="text-xs font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
                Dados corporais
              </p>
              <button
                type="button"
                onClick={() => setBodyEditOpen(true)}
                className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors cursor-pointer"
              >
                <PencilSimple size={12} weight="bold" />
                Editar
              </button>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden transition-colors duration-300">
              {hasBodyData ? (
                <>
                  {patient.gender && (
                    <div className="flex items-center gap-3 px-5 py-4 border-b border-neutral-100 dark:border-neutral-800">
                      <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                        {patient.gender === 'male'
                          ? <GenderMale size={15} weight="bold" className="text-neutral-500 dark:text-neutral-400" />
                          : <GenderFemale size={15} weight="bold" className="text-neutral-500 dark:text-neutral-400" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Sexo</p>
                        <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                          {GENDER_LABEL[patient.gender]?.label ?? '—'}
                        </p>
                      </div>
                    </div>
                  )}

                  {patient.weight !== null && (
                    <div className={`flex items-center gap-3 px-5 py-4 ${patient.height !== null || patient.age !== null ? 'border-b border-neutral-100 dark:border-neutral-800' : ''}`}>
                      <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                        <Scales size={15} weight="bold" className="text-neutral-500 dark:text-neutral-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Peso</p>
                        <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{patient.weight} kg</p>
                      </div>
                    </div>
                  )}

                  {patient.height !== null && (
                    <div className={`flex items-center gap-3 px-5 py-4 ${patient.age !== null ? 'border-b border-neutral-100 dark:border-neutral-800' : ''}`}>
                      <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                        <ArrowsVertical size={15} weight="bold" className="text-neutral-500 dark:text-neutral-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Altura</p>
                        <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{patient.height} cm</p>
                      </div>
                    </div>
                  )}

                  {patient.age !== null && (
                    <div className="flex items-center gap-3 px-5 py-4">
                      <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                        <Calendar size={15} weight="bold" className="text-neutral-500 dark:text-neutral-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Idade</p>
                        <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{patient.age} anos</p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setBodyEditOpen(true)}
                  className="w-full flex items-center gap-3 px-5 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors duration-200 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                    <PlusCircle size={15} weight="bold" className="text-neutral-500 dark:text-neutral-400" />
                  </div>
                  <span className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                    Adicionar peso, idade e sexo
                  </span>
                  <CaretRight size={14} weight="bold" className="text-neutral-400 dark:text-neutral-600 ml-auto shrink-0" />
                </button>
              )}
            </div>
          </section>
        )}

        {/* Preferências — tema */}
        <section className="mb-5">
          <p className="text-xs font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2 px-1">
            Preferências
          </p>
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-5 transition-colors duration-300">
            <p className="text-xs font-black text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-3">Tema</p>
            <div className="grid grid-cols-3 gap-2">
              {themeOptions.map(({ value, label, Icon }) => {
                const active = theme === value
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setTheme(value)}
                    className={`flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                      active
                        ? 'border-red-600 bg-red-50 dark:bg-red-950/30'
                        : 'border-transparent bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-150 dark:hover:bg-neutral-700'
                    }`}
                  >
                    <Icon size={18} weight={active ? 'fill' : 'regular'} className={active ? 'text-red-600' : 'text-neutral-500 dark:text-neutral-400'} />
                    <span className={`text-xs font-bold ${active ? 'text-red-600' : 'text-neutral-500 dark:text-neutral-400'}`}>
                      {label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* Suporte */}
        <section className="mb-5">
          <p className="text-xs font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2 px-1">
            Suporte
          </p>
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden transition-colors duration-300">
            {[
              { label: 'Perguntas frequentes', icon: Question, path: '/faq' },
              { label: 'Termos de uso', icon: FileText, path: '/terms' },
              { label: 'Política de privacidade', icon: ShieldCheck, path: '/privacy' },
            ].map(({ label, icon: Icon, path }, i, arr) => (
              <button
                key={path}
                type="button"
                onClick={() => navigate(path)}
                className={`w-full flex items-center gap-3 px-5 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors duration-200 cursor-pointer ${
                  i < arr.length - 1 ? 'border-b border-neutral-100 dark:border-neutral-800' : ''
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                  <Icon size={15} weight="bold" className="text-neutral-500 dark:text-neutral-400" />
                </div>
                <span className="flex-1 text-sm font-semibold text-neutral-800 dark:text-neutral-100 text-left">
                  {label}
                </span>
                <CaretRight size={14} weight="bold" className="text-neutral-400 dark:text-neutral-600 shrink-0" />
              </button>
            ))}
          </div>
        </section>

        {/* Sair */}
        <button
          type="button"
          onClick={() => signOut.mutate()}
          disabled={signOut.isPending}
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer shadow-sm"
        >
          {signOut.isPending ? (
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <SignOut size={17} weight="bold" />
          )}
          {signOut.isPending ? 'Saindo…' : 'Sair da conta'}
        </button>

      </div>

      <PatientBodyEditModal
        isOpen={bodyEditOpen}
        isPending={updateUser.isPending}
        defaultValues={{
          weight: patient?.weight ?? null,
          height: patient?.height ?? null,
          age: patient?.age ?? null,
          gender: patient?.gender ?? null,
        }}
        onClose={() => setBodyEditOpen(false)}
        onSave={(data) => updateUser.mutate(data, { onSuccess: () => setBodyEditOpen(false) })}
      />

      <UpdateCodeModal
        isOpen={codeModalOpen}
        currentCode={nutritionist?.code ?? null}
        isPending={updateCodeMutation.isPending}
        onClose={() => setCodeModalOpen(false)}
        onSave={(data) => updateCodeMutation.mutate(data, { onSuccess: () => setCodeModalOpen(false) })}
      />

      <AddNutritionistModal
        isOpen={addNutritionistOpen}
        isPending={makeRequestMutation.isPending}
        onClose={() => setAddNutritionistOpen(false)}
        onSend={(code) => makeRequestMutation.mutate(code, { onSuccess: () => setAddNutritionistOpen(false) })}
      />

      <ConfirmDeleteModal
        isOpen={confirmDisconnectOpen}
        onClose={() => setConfirmDisconnectOpen(false)}
        onConfirm={() => disconnectMutation.mutate(undefined, { onSuccess: () => setConfirmDisconnectOpen(false) })}
        isPending={disconnectMutation.isPending}
        title="Remover nutricionista?"
        description="Você perderá acesso ao plano alimentar atual. Esta ação não pode ser desfeita."
        confirmLabel="Remover"
      />
    </AppLayout>
  )
}
