import os

from sd_parser.course_parser import CourseParser, ClassRow
from tests.test_settings import RESOURCE_DIR


def test_basic_page():
    parser = CourseParser()
    classes = parser.parse_file(os.path.join(RESOURCE_DIR, "WI20_CSE.html"), "CSE")

    cse100 = [c for c in classes if c.course_num == "100" and c.section_type == "DI"]
    # There are two CSE 100 classes
    assert len(cse100) == 2

    first, second = cse100[0], cse100[1]
    assert isinstance(first, ClassRow) and isinstance(second, ClassRow)
    assert first.section_id is None and second.section_id is None

    assert second.course_id == "995097"

    assert first.department == "CSE"
    assert first.course_id == "995095"
    assert first.course_num == "100"
    assert first.instructor == "Cao, Yingjun"
    assert first.section_type == "DI"
    assert first.days == "M"
    assert first.times == "5:00p-5:50p"
    assert first.location == "SOLIS"
    assert first.room == "107"





