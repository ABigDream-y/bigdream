
export function getChangeNum(num: number) {
	if (num) {
		if (num < 10000) {
			return num;
		} else {
			if ((num % 10000) == 0) {
				return (num / 10000) + '万';
			} else if ((num % 10000) == 1) {
				return (num / 10000).toFixed(1) + '万';
			} else {
				return (num / 10000).toFixed(2) + '万';
			}
		}
	} else {
		return 0;
	}
}
