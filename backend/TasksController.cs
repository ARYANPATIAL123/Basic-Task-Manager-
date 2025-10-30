using Microsoft.AspNetCore.Mvc;
using TaskManagerAPI.Models;

namespace TaskManagerAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private static readonly List<TaskItem> _tasks = new();
    private static int _nextId = 1;

    [HttpGet]
    public ActionResult<List<TaskItem>> GetAll() => _tasks;

    [HttpPost]
    public ActionResult<TaskItem> Create(TaskItem item)
    {
        item.Id = _nextId++;
        _tasks.Add(item);
        return CreatedAtAction(nameof(GetAll), new { id = item.Id }, item);
    }

    [HttpPut("{id}")]
    public ActionResult<TaskItem> Toggle(int id)
    {
        var t = _tasks.FirstOrDefault(x => x.Id == id);
        if (t == null) return NotFound();
        t.IsCompleted = !t.IsCompleted;
        return t;
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var t = _tasks.FirstOrDefault(x => x.Id == id);
        if (t == null) return NotFound();
        _tasks.Remove(t);
        return NoContent();
    }
}
