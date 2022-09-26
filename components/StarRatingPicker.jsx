import { StarIcon } from '@heroicons/react/solid'
import { classNames } from '../utils'

const StarRatingPicker = ({ value, onChange, number = 5, className }) => {
	const values = Array.from({ length: number }, (_, index) => index + 1)

	return (
		<div className='flex items-center -space-x-2'>
			{values.map(num => {
				const isSelected = value && value >= num
				return (
					<span
						className={classNames(
							'block p-1 rounded cursor-pointer hover:scale-[1.2] transition-colors',
							className
						)}
						key={num}
						onClick={() => {
							onChange(num)
						}}>
						<StarIcon
							className={classNames(
								isSelected ? ' text-indigo-500' : 'text-gray-300',
								'w-6 h-6'
							)}
						/>
					</span>
				)
			})}
		</div>
	)
}

export default StarRatingPicker
