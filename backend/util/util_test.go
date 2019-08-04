package util

import (
	"testing"
)

func TestUniqStrSlice(t *testing.T) {

	ins := [][]string{{"a", "bb", "ccc", "a", "1", "123", "1"}, {"a", "a"}, {"a"}, {}}

	expecteds := [][]string{{"a", "bb", "ccc", "1", "123"}, {"a"}, {"a"}, {}}

	for i, in := range ins {

		expected := expecteds[i]

		got := UniqStrSlice(in)

		if len(got) != len(expected) {
			t.Fatalf("Uniq slice: Want %v, got %v", expected, got)
		}

		for j, s := range got {
			if s != expected[j] {
				t.Fatalf("Uniq slice: Want %v, got %v with mismatch at index %v", expected, got, j)
			}
		}

	}
}
