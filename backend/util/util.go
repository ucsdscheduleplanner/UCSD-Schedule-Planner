package util

// UniqStrSlice uniq a slice of str
func UniqStrSlice(input []string) (output []string) {
	contains := make(map[string]bool)
	for _, e := range input {
		if _, ok := contains[e]; !ok {
			contains[e] = true
			output = append(output, e)
		}
	}
	return
}
