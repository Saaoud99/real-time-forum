package websoc

import (
	"bufio"
	"fmt"
	"os"
)

func GetLineNumber(filename string, searchTerm string) (int, error) {
	file, err := os.Open(filename)
	if err != nil {
		return 0, err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	lineNum := 0
	for scanner.Scan() {
		lineNum++
		if scanner.Text() == searchTerm {
			return lineNum, nil
		}
	}

	return 0, fmt.Errorf("term not found")
}
