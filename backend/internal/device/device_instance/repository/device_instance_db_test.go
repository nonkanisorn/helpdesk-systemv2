package repository
 
import (
	"errors"
	"testing"

	"github.com/go-sql-driver/mysql"
)

func TestIsDuplicateSerialError(t *testing.T) {
	tests := []struct {
		name     string
		err      error
		expected bool
	}{
		{
			name:     "nil error",
			err:      nil,
			expected: false,
		},
		{
			name: "mysql 1062 duplicate serial number",
			err: &mysql.MySQLError{
				Number:  1062,
				Message: "Error 1062 (23000): Duplicate entry 'SN-001' for key 'uq_device_instances_serial_number'",
			},
			expected: true,
		},
		{
			name: "mysql 1062 duplicate device number",
			err: &mysql.MySQLError{
				Number:  1062,
				Message: "Error 1062 (23000): Duplicate entry '1-10' for key 'uq_device_instances_device_number'",
			},
			expected: false,
		},
		{
			name:     "standard error with duplicate serial text",
			err:      errors.New("Error 1062 (23000): Duplicate entry 'SN-999' for key 'uq_device_instances_serial_number'"),
			expected: true,
		},
		{
			name:     "unrelated mysql error",
			err:      errors.New("connection refused"),
			expected: false,
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			actual := isDuplicateSerialError(tc.err)
			if actual != tc.expected {
				t.Errorf("expected %v, got %v", tc.expected, actual)
			}
		})
	}
}
