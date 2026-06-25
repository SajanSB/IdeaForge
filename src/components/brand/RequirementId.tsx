interface RequirementIdProps {
  id: string
}

export function RequirementId({ id }: RequirementIdProps) {
  return (
    <span className="font-mono text-xs font-medium text-amber-primary tracking-[0.02em]">
      {id}
    </span>
  )
}
