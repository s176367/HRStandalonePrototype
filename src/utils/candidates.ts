import type { Mserp_hcmcandidatetohireentities } from '../generated/models/Mserp_hcmcandidatetohireentitiesModel'

export const getCandidateName = (
  candidate: Mserp_hcmcandidatetohireentities,
  fallbackLabel: string,
): string => {
  const firstName = candidate.mserp_firstname?.trim() ?? ''
  const lastName = candidate.mserp_lastname?.trim() ?? ''
  const fullName = [firstName, lastName].filter(Boolean).join(' ')
  return fullName || fallbackLabel
}

export const getFormattedValue = (
  candidate: Mserp_hcmcandidatetohireentities,
  field: string,
): string => {
  const formattedKey = `${field}@OData.Community.Display.V1.FormattedValue`
  const formattedValue = (candidate as unknown as Record<string, string | undefined>)[
    formattedKey
  ]
  if (formattedValue) {
    return formattedValue
  }
  const rawValue = (candidate as unknown as Record<string, unknown>)[field]
  if (rawValue === null || rawValue === undefined) {
    return '-'
  }
  return String(rawValue)
}

export const formatDate = (value?: string): string => {
  if (!value) {
    return '-'
  }
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return '-'
  }
  const day = String(parsed.getUTCDate()).padStart(2, '0')
  const month = String(parsed.getUTCMonth() + 1).padStart(2, '0')
  const year = parsed.getUTCFullYear()
  return `${day}-${month}-${year}`
}

export const getCandidateStatus = (
  candidate: Mserp_hcmcandidatetohireentities,
) => getFormattedValue(candidate, 'mserp_applicantintegrationresult')

export const isNotProcessed = (
  candidate: Mserp_hcmcandidatetohireentities,
) => {
  if (candidate.mserp_applicantintegrationresult === 200000000) {
    return true
  }
  if (String(candidate.mserp_applicantintegrationresult ?? '') === '200000000') {
    return true
  }
  return getCandidateStatus(candidate).toLowerCase() === 'notprocessed'
}

export const isHired = (candidate: Mserp_hcmcandidatetohireentities) =>
  getCandidateStatus(candidate).toLowerCase() === 'hired'
