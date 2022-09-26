export { default as data } from './data'
export * from './filters'
export { default as slugify } from './slugify'
export { default as useStyles } from './styles'

export function classNames(...classes) {
	return classes.filter(Boolean).join(' ')
}
