import { useParams } from 'react-router-dom'
import AppLayout from '@/shared/layouts/AppLayout'
import CreatePlanModal from '@/modules/plan/components/CreatePlanModal'
import PlanEditModal from '@/modules/plan/components/PlanEditModal'
import { useNutritionistPatientPage } from '@/modules/nutritionist/hooks/useNutritionistPatientPage'
import PatientHeader from '@/modules/nutritionist/components/PatientHeader'
import PatientPlanSection from '@/modules/nutritionist/components/PatientPlanSection'
import PatientPlanMealsSection from '@/modules/nutritionist/components/PatientPlanMealsSection'
import PatientDiarySection from '@/modules/nutritionist/components/PatientDiarySection'
import AddPatientMealModal from '@/modules/nutritionist/components/AddPatientMealModal'
import ConfirmDeletePatientMealModal from '@/modules/nutritionist/components/ConfirmDeletePatientMealModal'
import ConfirmDeleteModal from '@/shared/components/ConfirmDeleteModal'

export default function NutritionistPatientPage() {
  const { patientId } = useParams<{ patientId: string }>()

  const {
    id, patient, hasBodyData,
    plan, planPending, meals, mealsPending,
    createPlanMutation, editPlanMutation, deletePlanMutation,
    createMealMutation, deleteMealMutation,
    createPlanOpen, setCreatePlanOpen, createPlanMode, openCreatePlan,
    editPlanOpen, setEditPlanOpen,
    confirmDeletePlan, setConfirmDeletePlan,
    addMealOpen, setAddMealOpen,
    confirmDeleteMealId, setConfirmDeleteMealId,
    handleDeletePlan, handleDeleteMeal,
    confirmRemovePatient, setConfirmRemovePatient, handleRemovePatient, removePatientMutation,
    diaryDay, prevDay, nextDay, isDiaryToday,
  } = useNutritionistPatientPage(patientId ?? '')

  return (
    <AppLayout>
      <div className="px-4 sm:px-10 lg:px-16 pt-10 pb-16 max-w-5xl mx-auto">
        <PatientHeader patient={patient} onRemovePatient={() => setConfirmRemovePatient(true)} />

        <PatientPlanSection
          plan={plan}
          planPending={planPending}
          hasBodyData={hasBodyData}
          confirmDeletePlan={confirmDeletePlan}
          isDeletePending={deletePlanMutation.isPending}
          onOpenCreatePlan={openCreatePlan}
          onOpenEditPlan={() => setEditPlanOpen(true)}
          onAskDeletePlan={() => setConfirmDeletePlan(true)}
          onCancelDeletePlan={() => setConfirmDeletePlan(false)}
          onConfirmDeletePlan={handleDeletePlan}
        />

        <PatientPlanMealsSection
          meals={meals}
          mealsPending={mealsPending}
          patientId={id}
          onAddClick={() => setAddMealOpen(true)}
          onAskDelete={(mealId) => setConfirmDeleteMealId(mealId)}
        />

        <PatientDiarySection
          patientId={id}
          selectedDay={diaryDay}
          plan={plan}
          onPrevDay={prevDay}
          onNextDay={nextDay}
          isToday={isDiaryToday}
        />
      </div>

      <CreatePlanModal
        isOpen={createPlanOpen}
        onClose={() => setCreatePlanOpen(false)}
        onSubmit={(data) => createPlanMutation.mutate(data, { onSuccess: () => setCreatePlanOpen(false) })}
        isPending={createPlanMutation.isPending}
        initialMode={createPlanMode}
        isNutritionist
      />

      {plan && (
        <PlanEditModal
          isOpen={editPlanOpen}
          onClose={() => setEditPlanOpen(false)}
          defaultValues={{ calories: plan.calories, protein: plan.protein, carbs: plan.carbs, fat: plan.fat }}
          isPending={editPlanMutation.isPending}
          onSave={(data) => editPlanMutation.mutate(data, { onSuccess: () => setEditPlanOpen(false) })}
        />
      )}

      <AddPatientMealModal
        isOpen={addMealOpen}
        isPending={createMealMutation.isPending}
        onClose={() => setAddMealOpen(false)}
        onSelect={(mealType) => createMealMutation.mutate(mealType, { onSuccess: () => setAddMealOpen(false) })}
      />

      <ConfirmDeletePatientMealModal
        mealId={confirmDeleteMealId}
        isPending={deleteMealMutation.isPending}
        onClose={() => setConfirmDeleteMealId(null)}
        onConfirm={handleDeleteMeal}
      />

      <ConfirmDeleteModal
        isOpen={confirmRemovePatient}
        onClose={() => setConfirmRemovePatient(false)}
        onConfirm={handleRemovePatient}
        isPending={removePatientMutation.isPending}
        title="Remover paciente?"
        description="O paciente será desvinculado de você e perderá o acesso ao plano. Esta ação não pode ser desfeita."
        confirmLabel="Remover"
      />
    </AppLayout>
  )
}
